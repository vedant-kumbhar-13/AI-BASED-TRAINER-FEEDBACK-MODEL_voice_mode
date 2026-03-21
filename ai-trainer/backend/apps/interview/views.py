"""
Interview Module Views

API endpoints for the AI Interview Module.
"""

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
import logging

from .models import Resume, InterviewSession, InterviewQuestion, InterviewAnswer, InterviewFeedback, EvaluationResult
from .serializers import (
    ResumeUploadSerializer, ResumeDetailSerializer, ResumeListSerializer,
    InterviewStartSerializer, InterviewSessionSerializer, InterviewSessionListSerializer,
    InterviewQuestionSerializer, AnswerSubmitSerializer, InterviewAnswerSerializer,
    InterviewFeedbackSerializer, SessionWithFeedbackSerializer, InterviewHistorySerializer
)
from .services import GeminiService, ResumeParser, FeedbackGenerator, WhisperService
from services.openai_service import generate_questions, evaluate_interview
import json

logger = logging.getLogger(__name__)


# ===========================================
# Resume Views
# ===========================================

class ResumeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for resume upload and management.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeUploadSerializer
        elif self.action == 'list':
            return ResumeListSerializer
        return ResumeDetailSerializer

    def create(self, request, *args, **kwargs):
        """Upload and parse a resume."""
        serializer = ResumeUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create resume record
        resume = serializer.save(user=request.user)
        
        try:
            # Parse the resume
            parser = ResumeParser()
            raw_text = parser.extract_text_from_pdf(resume.file)
            
            # Use Gemini for advanced parsing
            gemini = GeminiService()
            parsed_data = gemini.parse_resume_with_ai(raw_text)
            
            # Update resume with parsed data
            resume.raw_text = raw_text
            resume.skills = parsed_data.get('skills', [])
            resume.experience = parsed_data.get('experience', [])
            resume.education = parsed_data.get('education', [])
            resume.projects = parsed_data.get('projects', [])
            resume.summary = parsed_data.get('summary', '')
            resume.is_parsed = True
            resume.save()
            
            return Response(
                ResumeDetailSerializer(resume).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Resume parsing error: {str(e)}")
            # Return resume even if parsing fails
            return Response(
                {
                    **ResumeDetailSerializer(resume).data,
                    'parsing_error': str(e)
                },
                status=status.HTTP_201_CREATED
            )

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        """Get resume summary for interview context."""
        resume = self.get_object()
        parser = ResumeParser()
        context = parser.get_context_for_interview({
            'skills': resume.skills,
            'experience': resume.experience,
            'education': resume.education,
            'projects': resume.projects
        })
        return Response({
            'id': str(resume.id),
            'context': context,
            'skills': resume.skills,
            'summary': resume.summary
        })


# ===========================================
# Interview Session Views
# ===========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_interview(request):
    """
    Start a new interview session.
    Generates ALL 8 questions upfront in a single Gemini call.

    Request body:
    {
        "resume_id": "uuid",           // required
        "interview_type": "Technical",  // HR | Technical | Behavioral | Mixed
        "total_questions": 8
    }

    Responses:
        201 — { session_id, questions: [{id, order, text, type}] }
        400 — { error: 'resume_id is required' }
        404 — { error: 'Resume not found' }
        409 — { error: 'Active session exists', session_id: str }
        503 — { error: 'Question generation failed: <msg>' }
    """
    resume_id = request.data.get('resume_id')

    # Auto-abandon any stuck in_progress session for this user so they can start fresh
    existing = InterviewSession.objects.filter(
        user=request.user,
        status='in_progress'
    ).first()
    if existing:
        existing.status = 'abandoned'
        existing.end_time = timezone.now()
        existing.save()
        logger.info(f"Auto-abandoned stuck session {existing.id} for user {request.user.id}")


    # Resolve the resume — use provided resume_id, or fall back to the user's latest resume
    resume = None
    if resume_id:
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response(
                {'error': 'Resume not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        # Fallback: use the most recently uploaded resume for this user
        resume = Resume.objects.filter(user=request.user).order_by('-created_at').first()
        if not resume:
            return Response(
                {'error': 'No resume found. Please upload a resume first.'},
                status=status.HTTP_404_NOT_FOUND
            )

    interview_type = request.data.get('interview_type', 'Technical')

    # 503 — generate all 8 questions in ONE Gemini call
    try:
        raw_questions = generate_questions(resume)
    except Exception as e:
        logger.error(f"Question generation failed: {e}")
        return Response(
            {'error': f'Question generation failed: {str(e)}'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    # Create session + all questions atomically
    with transaction.atomic():
        session = InterviewSession.objects.create(
            user=request.user,
            resume=resume,
            interview_type=interview_type,
            total_questions=8,
            status='in_progress',
            start_time=timezone.now(),
            current_question_index=1,
        )

        question_list = []
        for order_num, q in enumerate(raw_questions, start=1):
            question = InterviewQuestion.objects.create(
                session=session,
                question_text=q.get('text', ''),
                question_number=order_num,
                category=q.get('type', 'Technical').lower(),
                difficulty=3,
            )
            question_list.append({
                'id':    str(question.id),
                'order': order_num,
                'text':  question.question_text,
                'type':  q.get('type', 'Technical'),
            })

    return Response(
        {
            'session_id': str(session.id),
            'questions':  question_list,
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_question(request, session_id):
    """Get the current question for a session."""
    session = get_object_or_404(
        InterviewSession, id=session_id, user=request.user
    )
    
    if session.status != 'in_progress':
        return Response(
            {'error': 'Interview session is not in progress'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    question = session.questions.filter(
        question_number=session.current_question_index
    ).first()
    
    if not question:
        return Response(
            {'error': 'No question found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    return Response({
        'session_id': str(session.id),
        'question': InterviewQuestionSerializer(question).data,
        'questions_remaining': session.total_questions - session.current_question_index
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    """
    Submit an answer and get AI feedback.
    
    Request body:
    {
        "session_id": "uuid",
        "question_id": "uuid",
        "answer_text": "User's answer...",
        "answer_duration_seconds": 90
    }
    """
    serializer = AnswerSubmitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    
    session = get_object_or_404(
        InterviewSession, id=data['session_id'], user=request.user
    )
    question = get_object_or_404(
        InterviewQuestion, id=data['question_id'], session=session
    )
    
    if session.status != 'in_progress':
        return Response(
            {'error': 'Interview session is not in progress'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if already answered
    if hasattr(question, 'answer') and question.answer:
        return Response(
            {'error': 'Question already answered'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Evaluate answer with Gemini
        gemini = GeminiService()
        evaluation = gemini.evaluate_answer(
            question=question.question_text,
            answer=data['answer_text'],
            expected_points=question.expected_points,
            interview_type=session.interview_type
        )
        
        # Save answer
        answer = InterviewAnswer.objects.create(
            question=question,
            answer_text=data['answer_text'],
            answer_duration_seconds=data.get('answer_duration_seconds'),
            score=evaluation['score'],
            ai_feedback=evaluation['ai_feedback'],
            strengths=evaluation.get('strengths', []),
            improvements=evaluation.get('improvements', []),
            key_points_covered=evaluation.get('key_points_covered', []),
            key_points_missed=evaluation.get('key_points_missed', []),
            relevance_score=evaluation.get('relevance_score'),
            clarity_score=evaluation.get('clarity_score'),
            depth_score=evaluation.get('depth_score')
        )
        
        response_data = {
            'answer': InterviewAnswerSerializer(answer).data,
            'is_last_question': question.question_number >= session.total_questions
        }
        
        # Generate next question if not last
        if question.question_number < session.total_questions:
            # Get previous questions for context
            previous_questions = list(
                session.questions.values_list('question_text', flat=True)
            )
            
            # Generate next question
            resume_context = question.context_used
            next_question_data = gemini.generate_interview_question(
                interview_type=session.interview_type,
                question_number=question.question_number + 1,
                total_questions=session.total_questions,
                resume_context=resume_context,
                previous_questions=previous_questions
            )
            
            next_question = InterviewQuestion.objects.create(
                session=session,
                question_text=next_question_data['question_text'],
                question_number=question.question_number + 1,
                category=next_question_data.get('category', 'general'),
                difficulty=next_question_data.get('difficulty', 3),
                context_used=resume_context,
                expected_points=next_question_data.get('expected_points', []),
                suggested_time_seconds=next_question_data.get('suggested_time_seconds', 120)
            )
            
            session.current_question_index = question.question_number + 1
            session.save()
            
            response_data['next_question'] = InterviewQuestionSerializer(next_question).data
        
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Error submitting answer: {str(e)}")
        return Response(
            {'error': f"Failed to evaluate answer: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_interview(request, session_id):
    """End an interview session and generate final feedback."""
    session = get_object_or_404(
        InterviewSession, id=session_id, user=request.user
    )
    
    if session.status == 'completed':
        return Response(
            {'error': 'Interview already completed'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        with transaction.atomic():
            # Update session status
            session.status = 'completed'
            session.end_time = timezone.now()
            
            # Get all questions and answers
            questions_answers = []
            for question in session.questions.all().order_by('question_number'):
                qa = {
                    'question': question.question_text,
                    'category': question.category,
                    'score': 0
                }
                if hasattr(question, 'answer') and question.answer:
                    qa['answer'] = question.answer.answer_text
                    qa['score'] = question.answer.score
                    qa['answer_data'] = {
                        'relevance_score': question.answer.relevance_score,
                        'clarity_score': question.answer.clarity_score,
                        'depth_score': question.answer.depth_score,
                        'strengths': question.answer.strengths,
                        'improvements': question.answer.improvements
                    }
                questions_answers.append(qa)
            
            # Calculate scores using FeedbackGenerator
            feedback_gen = FeedbackGenerator()
            scores = feedback_gen.calculate_overall_score(
                [qa.get('answer_data', {}) for qa in questions_answers],
                session.interview_type
            )
            
            session.overall_score = scores['overall_score']
            session.communication_score = scores['communication_score']
            session.technical_score = scores['technical_score']
            session.confidence_score = scores['confidence_score']
            session.save()
            
            # Generate AI feedback
            gemini = GeminiService()
            session_data = {
                'interview_type': session.interview_type,
                'total_questions': session.total_questions
            }
            ai_feedback = gemini.generate_session_feedback(session_data, questions_answers)
            
            # Create feedback record
            feedback = InterviewFeedback.objects.create(
                session=session,
                overall_summary=ai_feedback.get('overall_summary', ''),
                overall_rating=ai_feedback.get('overall_rating', 'average'),
                strengths=ai_feedback.get('strengths', []),
                weaknesses=ai_feedback.get('weaknesses', []),
                suggestions=ai_feedback.get('suggestions', []),
                topic_scores=ai_feedback.get('topic_scores', {}),
                recommended_resources=ai_feedback.get('recommended_resources', []),
                practice_areas=ai_feedback.get('practice_areas', [])
            )
            
            return Response({
                'session': InterviewSessionSerializer(session).data,
                'feedback': InterviewFeedbackSerializer(feedback).data
            })
            
    except Exception as e:
        logger.error(f"Error ending interview: {str(e)}")
        return Response(
            {'error': f"Failed to generate feedback: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_feedback(request, session_id):
    """Get detailed feedback for a completed interview."""
    session = get_object_or_404(
        InterviewSession, id=session_id, user=request.user
    )
    
    if session.status != 'completed':
        return Response(
            {'error': 'Interview not yet completed'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response(SessionWithFeedbackSerializer(session).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_history(request):
    """Get user's interview history."""
    sessions = InterviewSession.objects.filter(
        user=request.user
    ).order_by('-created_at')
    
    # Optional filters
    interview_type = request.query_params.get('type')
    status_filter = request.query_params.get('status')
    
    if interview_type:
        sessions = sessions.filter(interview_type=interview_type)
    if status_filter:
        sessions = sessions.filter(status=status_filter)
    
    # Pagination
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))
    start = (page - 1) * page_size
    end = start + page_size
    
    total = sessions.count()
    sessions = sessions[start:end]
    
    return Response({
        'results': InterviewHistorySerializer(sessions, many=True).data,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_interview(request, session_id):
    """Delete an interview session."""
    session = get_object_or_404(
        InterviewSession, id=session_id, user=request.user
    )
    session.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_stats(request):
    """Get user's interview statistics."""
    sessions = InterviewSession.objects.filter(
        user=request.user,
        status='completed'
    )
    
    total_interviews = sessions.count()
    
    if total_interviews == 0:
        return Response({
            'total_interviews': 0,
            'average_score': 0,
            'best_score': 0,
            'improvement': 0,
            'by_type': {}
        })
    
    scores = list(sessions.values_list('overall_score', flat=True))
    scores = [s for s in scores if s is not None]
    
    avg_score = sum(scores) / len(scores) if scores else 0
    best_score = max(scores) if scores else 0
    
    # Calculate improvement (last 5 vs first 5)
    if len(scores) >= 2:
        recent = scores[-5:] if len(scores) >= 5 else scores[-len(scores)//2:]
        early = scores[:5] if len(scores) >= 5 else scores[:len(scores)//2]
        improvement = (sum(recent)/len(recent)) - (sum(early)/len(early)) if early else 0
    else:
        improvement = 0
    
    # Stats by type
    by_type = {}
    for interview_type in ['HR', 'Technical', 'Behavioral', 'Mixed']:
        type_sessions = sessions.filter(interview_type=interview_type)
        type_scores = [s for s in type_sessions.values_list('overall_score', flat=True) if s]
        by_type[interview_type] = {
            'count': type_sessions.count(),
            'average_score': sum(type_scores)/len(type_scores) if type_scores else 0
        }
    
    return Response({
        'total_interviews': total_interviews,
        'average_score': round(avg_score, 1),
        'best_score': round(best_score, 1),
        'improvement': round(improvement, 1),
        'by_type': by_type
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transcribe_audio(request):
    """
    Transcribe audio file to text using Whisper.
    
    Request: multipart/form-data with 'audio' file
    Returns: { success: bool, text: string, error?: string }
    """
    audio_file = request.FILES.get('audio')
    
    if not audio_file:
        return Response(
            {'success': False, 'error': 'No audio file provided', 'text': ''},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        whisper = WhisperService()
        result = whisper.transcribe_audio(audio_file)
        return Response(result)
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        return Response(
            {'success': False, 'error': str(e), 'text': ''},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===========================================
# Submit-All Endpoint (BUG-04 Fix)
# ===========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_all(request):
    """
    Submit ALL 8 answers at once and get a holistic Gemini evaluation.
    Replaces 8 sequential /submit-answer/ calls with a single Gemini call.
    Fixes BUG-04.

    Request body:
    {
        "session_id": "uuid",
        "answers": [
            {
                "questionId":   "uuid",
                "questionText": "...",
                "questionType": "Technical",
                "answerText":   "User's spoken/typed answer"
            },
            ... (8 total)
        ]
    }

    Responses:
        200 — full evaluation dict + evaluation_id + session_id
        400 — { error: 'session_id and answers[] are required' }
        400 — { error: 'Minimum 3 answers required' }
        404 — session not found or wrong user
        409 — { error: 'Session already evaluated' }
        503 — { error: 'Evaluation failed: <msg>' }
    """
    session_id = request.data.get('session_id')
    answers    = request.data.get('answers', [])

    # 400 — basic validation
    if not session_id or not answers:
        return Response(
            {'error': 'session_id and answers[] are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(answers) < 3:
        return Response(
            {'error': 'Minimum 3 answers required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 404 — session must belong to this user
    try:
        session = InterviewSession.objects.get(id=session_id, user=request.user)
    except InterviewSession.DoesNotExist:
        return Response(
            {'error': 'Session not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # 409 — already evaluated
    if session.status == 'completed':
        return Response(
            {'error': 'Session already evaluated'},
            status=status.HTTP_409_CONFLICT
        )

    # 503 — single Gemini holistic evaluation call (BUG-04 fix)
    try:
        evaluation = evaluate_interview(answers)
    except ValueError as e:
        logger.error(f"Evaluation failed for session {session_id}: {e}")
        return Response(
            {'error': f'Evaluation failed: {str(e)}'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    # Persist results atomically
    with transaction.atomic():
        scores = evaluation.get('scores', {})

        # Gemini returns 0.0-10.0 — multiply × 10 to store as 0-100 (BUG-16 fix)
        def to_100(val):
            try:
                return float(val or 0) * 10
            except (TypeError, ValueError):
                return 0.0

        # Update session scores and mark completed
        session.status              = 'completed'
        session.end_time            = timezone.now()
        session.overall_score       = to_100(evaluation.get('overall_score'))
        session.communication_score = to_100(scores.get('communication'))
        session.technical_score     = to_100(scores.get('technical'))
        session.confidence_score    = to_100(scores.get('confidence'))
        session.hr_avg_score        = to_100(scores.get('hr'))
        session.save()

        # Create EvaluationResult record
        result = EvaluationResult.objects.create(
            session                 = session,
            overall_score           = to_100(evaluation.get('overall_score')),
            hr_score                = to_100(scores.get('hr')),
            technical_score         = to_100(scores.get('technical')),
            communication_score     = to_100(scores.get('communication')),
            confidence_score        = to_100(scores.get('confidence')),
            structure_score         = to_100(scores.get('structure')),
            summary_feedback        = evaluation.get('summary', ''),
            top_strength            = evaluation.get('top_strength', ''),
            top_weakness            = evaluation.get('top_weakness', ''),
            top_3_recommendations   = json.dumps(evaluation.get('recommendations', [])),
            placement_readiness     = evaluation.get('placement_readiness', 'needs_work'),
        )

        # Save per-question AI scores into InterviewAnswer rows
        for qr in evaluation.get('question_results', []):
            q_index = qr.get('question_index')
            if q_index is None:
                continue
            try:
                question = session.questions.get(question_number=q_index)
                InterviewAnswer.objects.update_or_create(
                    question=question,
                    defaults={
                        'answer_text':  question.answer_text or '[No answer provided]',
                        'score':        to_100(qr.get('score')),
                        'ai_feedback':  qr.get('feedback', ''),
                        'strengths':    [qr.get('strength', '')] if qr.get('strength') else [],
                        'improvements': [qr.get('improvement', '')] if qr.get('improvement') else [],
                    }
                )
            except InterviewQuestion.DoesNotExist:
                continue

    return Response(
        {
            **evaluation,
            'evaluation_id': str(result.id),
            'session_id':    str(session.id),
        },
        status=status.HTTP_200_OK
    )
