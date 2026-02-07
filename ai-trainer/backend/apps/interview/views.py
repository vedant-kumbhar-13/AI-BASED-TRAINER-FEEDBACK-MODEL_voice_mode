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

from .models import Resume, InterviewSession, InterviewQuestion, InterviewAnswer, InterviewFeedback
from .serializers import (
    ResumeUploadSerializer, ResumeDetailSerializer, ResumeListSerializer,
    InterviewStartSerializer, InterviewSessionSerializer, InterviewSessionListSerializer,
    InterviewQuestionSerializer, AnswerSubmitSerializer, InterviewAnswerSerializer,
    InterviewFeedbackSerializer, SessionWithFeedbackSerializer, InterviewHistorySerializer
)
from .services import GeminiService, ResumeParser, FeedbackGenerator, WhisperService

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
    
    Request body:
    {
        "interview_type": "Technical",  // HR, Technical, Behavioral, Mixed
        "resume_id": "uuid-optional",
        "total_questions": 5,
        "duration_minutes": 15
    }
    """
    serializer = InterviewStartSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    
    # Get resume if provided
    resume = None
    if data.get('resume_id'):
        resume = get_object_or_404(
            Resume, id=data['resume_id'], user=request.user
        )
    
    # Create session
    session = InterviewSession.objects.create(
        user=request.user,
        resume=resume,
        interview_type=data['interview_type'],
        total_questions=data['total_questions'],
        duration_minutes=data['duration_minutes'],
        status='in_progress',
        start_time=timezone.now()
    )
    
    # Generate first question
    try:
        gemini = GeminiService()
        resume_context = ""
        if resume and resume.is_parsed:
            parser = ResumeParser()
            resume_context = parser.get_context_for_interview({
                'skills': resume.skills,
                'experience': resume.experience,
                'education': resume.education,
                'projects': resume.projects
            })
        
        question_data = gemini.generate_interview_question(
            interview_type=data['interview_type'],
            question_number=1,
            total_questions=data['total_questions'],
            resume_context=resume_context
        )
        
        question = InterviewQuestion.objects.create(
            session=session,
            question_text=question_data['question_text'],
            question_number=1,
            category=question_data.get('category', 'general'),
            difficulty=question_data.get('difficulty', 3),
            context_used=resume_context,
            expected_points=question_data.get('expected_points', []),
            suggested_time_seconds=question_data.get('suggested_time_seconds', 120)
        )
        
        session.current_question_index = 1
        session.save()
        
        return Response({
            'session': InterviewSessionSerializer(session).data,
            'current_question': InterviewQuestionSerializer(question).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error starting interview: {str(e)}")
        session.status = 'cancelled'
        session.save()
        return Response(
            {'error': f"Failed to generate question: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
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

