"""
Gemini AI API calls — question generation and holistic interview evaluation.
Wraps google-generativeai SDK (v0.7+) for use across the interview app.
"""

import os
import re
import json

import google.generativeai as genai

# ---------------------------------------------------------------------------
# SDK Configuration — reads GEMINI_API_KEY via Django settings (loaded from
# .env by python-decouple). Fall back to os.getenv for non-Django contexts.
# ---------------------------------------------------------------------------
def _get_api_key() -> str:
    try:
        from django.conf import settings
        key = getattr(settings, 'GEMINI_API_KEY', None)
        if key:
            return key
    except Exception:
        pass
    return os.getenv('GEMINI_API_KEY', '')

genai.configure(api_key=_get_api_key())

MODEL_NAME = 'gemini-2.5-flash'


# ---------------------------------------------------------------------------
# FUNCTION 1: generate_questions(resume)
#
# Generates exactly 8 personalised interview questions from a parsed resume.
# Distribution: Q1=HR opener, Q2=Behavioral, Q3=HR closing, Q4-Q8=Technical
# Returns: list of 8 dicts → [{text: str, type: str}, ...]
# ---------------------------------------------------------------------------
def generate_questions(resume):
    """
    Generate 8 interview questions tailored to the candidate's resume.

    Args:
        resume (dict or Resume model instance): parsed resume with fields:
            raw_text, skills, experience, education, projects, summary

    Returns:
        list: 8 dicts, each with 'text' (question string) and 'type' (HR/Technical/Behavioral)

    Raises:
        ValueError: if Gemini returns invalid JSON or not exactly 8 questions
    """
    # -----------------------------------------------------------------------
    # Build resume context from available fields
    # -----------------------------------------------------------------------
    # Support both dict and Django model instance
    if hasattr(resume, '__dict__'):
        skills      = resume.skills      if hasattr(resume, 'skills')      else []
        experience  = resume.experience  if hasattr(resume, 'experience')   else []
        education   = resume.education   if hasattr(resume, 'education')    else []
        projects    = resume.projects    if hasattr(resume, 'projects')     else []
        summary     = resume.summary     if hasattr(resume, 'summary')      else ''
    else:
        skills      = resume.get('skills', [])
        experience  = resume.get('experience', [])
        education   = resume.get('education', [])
        projects    = resume.get('projects', [])
        summary     = resume.get('summary', '')

    # Extract candidate name + degree from experience/education if available
    candidate_name = 'the candidate'
    degree_branch  = 'Engineering'
    cgpa           = ''

    if education and isinstance(education, list) and len(education) > 0:
        edu = education[0]
        if isinstance(edu, dict):
            degree_branch = edu.get('degree', degree_branch)
            cgpa_val      = edu.get('cgpa', edu.get('gpa', ''))
            if cgpa_val:
                cgpa = f"CGPA: {cgpa_val}"

    # Summarise projects for the prompt
    project_summaries = []
    if isinstance(projects, list):
        for p in projects[:4]:  # cap at 4 to stay within token limit
            if isinstance(p, dict):
                name = p.get('name', '')
                desc = p.get('description', p.get('summary', ''))
                techs = ', '.join(p.get('technologies', []))
                if name:
                    project_summaries.append(f"- {name}: {desc} (Tech: {techs})" if techs else f"- {name}: {desc}")
            elif isinstance(p, str):
                project_summaries.append(f"- {p}")

    # Flatten skills list
    skills_str = ', '.join(skills) if isinstance(skills, list) else str(skills)

    # -----------------------------------------------------------------------
    # Prompt
    # -----------------------------------------------------------------------
    user_prompt = f"""
Candidate Profile:
- Name: {candidate_name}
- Degree/Branch: {degree_branch}
- {cgpa}
- Skills: {skills_str or 'Not specified'}
- Projects:
{chr(10).join(project_summaries) or '  Not specified'}
- Summary: {summary or 'Not provided'}

Generate exactly 8 interview questions following this STRICT distribution:
Q1 - Type: HR       - A warm opening question (introduce yourself, career goals)
Q2 - Type: Behavioral - A situation-based question (teamwork, conflict, leadership)
Q3 - Type: HR       - A closing HR question (strengths/weaknesses, why this company)
Q4 - Type: Technical - MUST reference a specific skill from their skills list
Q5 - Type: Technical - MUST reference a specific project they have listed
Q6 - Type: Technical - A core CS concept relevant to their degree/skills
Q7 - Type: Technical - A problem-solving or design question tied to their stack
Q8 - Type: Technical - A depth question probing understanding of a key technology

Return ONLY a valid JSON array. No explanation. No markdown. No backticks.

Format:
[
  {{"text": "question here", "type": "HR"}},
  {{"text": "question here", "type": "Behavioral"}},
  ...
]
"""

    system_instruction = (
        "You are an expert technical interviewer at a top Indian IT company. "
        "You personalise every question to the candidate's actual resume. "
        "Return ONLY valid JSON. No preamble. No backticks. No explanation."
    )

    # -----------------------------------------------------------------------
    # Gemini API call
    # -----------------------------------------------------------------------
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=system_instruction,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=3000,
        )
    )

    response = model.generate_content(user_prompt)
    raw_text = response.text.strip()

    # Strip accidental backtick code fences (```json ... ```)
    raw_text = re.sub(r'^```(?:json)?\s*', '', raw_text)
    raw_text = re.sub(r'\s*```$', '', raw_text)
    raw_text = raw_text.strip()

    try:
        questions = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON for questions: {e}\nRaw: {raw_text[:300]}")

    if not isinstance(questions, list) or len(questions) != 8:
        raise ValueError(
            f"Expected a list of exactly 8 questions, got {type(questions).__name__} "
            f"with {len(questions) if isinstance(questions, list) else '?'} items."
        )

    return questions


# ---------------------------------------------------------------------------
# FUNCTION 2: evaluate_interview(answers)
#
# Sends ALL 8 Q&A pairs to Gemini in ONE call for holistic evaluation.
# This replaces the per-answer approach (BUG-04 fix).
# Returns: full evaluation dict
# ---------------------------------------------------------------------------
def evaluate_interview(answers):
    """
    Holistically evaluate a complete interview using all 8 Q&A pairs at once.
    Single Gemini call — fixes BUG-04 (was 5+ sequential calls before).

    Args:
        answers (list): 8 dicts, each with:
            {questionId, questionText, questionType, answerText}

    Returns:
        dict: full evaluation with scores, feedback, and placement readiness

    Raises:
        ValueError: if Gemini returns invalid JSON or API call fails
    """
    try:
        # -----------------------------------------------------------------------
        # Build a readable transcript from all answers
        # -----------------------------------------------------------------------
        transcript_lines = []
        for i, ans in enumerate(answers, start=1):
            q_text   = ans.get('questionText', ans.get('question_text', f'Question {i}'))
            q_type   = ans.get('questionType', ans.get('question_type', 'Technical'))
            a_text   = ans.get('answerText',   ans.get('answer_text',   '[No answer provided]'))
            transcript_lines.append(
                f"Q{i} [{q_type}]: {q_text}\n"
                f"Answer: {a_text}"
            )

        transcript = "\n\n".join(transcript_lines)

        # -----------------------------------------------------------------------
        # Prompt
        # -----------------------------------------------------------------------
        user_prompt = f"""
Below is the complete transcript of an interview with 8 questions and answers.
Evaluate the candidate holistically — consider ALL answers together.

--- TRANSCRIPT START ---
{transcript}
--- TRANSCRIPT END ---

Return ONLY a valid JSON object with this exact structure (no extra keys, no backticks):

{{
  "overall_score": <float 0.0-10.0>,
  "placement_readiness": <"not_ready"|"needs_work"|"almost_ready"|"ready"|"highly_ready">,
  "summary": "<4-5 sentence holistic assessment>",
  "top_strength": "<single biggest strength observed>",
  "top_weakness": "<single most important area to improve>",
  "recommendations": [
    "<actionable recommendation 1>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>"
  ],
  "scores": {{
    "overall": <float 0.0-10.0>,
    "hr": <float 0.0-10.0>,
    "technical": <float 0.0-10.0>,
    "communication": <float 0.0-10.0>,
    "confidence": <float 0.0-10.0>,
    "structure": <float 0.0-10.0>
  }},
  "question_results": [
    {{
      "question_index": <1-8>,
      "score": <float 0.0-10.0>,
      "feedback": "<2-3 sentence specific feedback>",
      "strength": "<one strength for this answer>",
      "improvement": "<one improvement for this answer>"
    }}
  ]
}}
"""

        system_instruction = (
            "You are an unbiased expert HR evaluator with 20 years of campus recruitment experience. "
            "Evaluate interview answers fairly. Be specific — reference what the candidate actually said. "
            "Return ONLY valid JSON. Scores are 0.0-10.0. No preamble. No backticks."
        )

        # -----------------------------------------------------------------------
        # Gemini API call — low temperature for consistent, fair scoring
        # -----------------------------------------------------------------------
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=system_instruction,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                max_output_tokens=3000,
            )
        )

        response = model.generate_content(user_prompt)
        raw_text = response.text.strip()

        # Strip accidental backtick code fences
        raw_text = re.sub(r'^```(?:json)?\s*', '', raw_text)
        raw_text = re.sub(r'\s*```$', '', raw_text)
        raw_text = raw_text.strip()

        evaluation = json.loads(raw_text)
        return evaluation

    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON for evaluation: {e}\nRaw: {raw_text[:300]}")
    except Exception as e:
        raise ValueError(f"Interview evaluation failed: {str(e)}")
