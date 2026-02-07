"""
Interview Module URL Configuration

API routes for the AI Interview Module.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router for ViewSets
router = DefaultRouter()
router.register(r'resume', views.ResumeViewSet, basename='resume')

app_name = 'interview'

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Interview Session endpoints
    path('start/', views.start_interview, name='start-interview'),
    path('question/<uuid:session_id>/', views.get_current_question, name='get-question'),
    path('submit-answer/', views.submit_answer, name='submit-answer'),
    path('end/<uuid:session_id>/', views.end_interview, name='end-interview'),
    
    # Feedback & History
    path('feedback/<uuid:session_id>/', views.get_interview_feedback, name='get-feedback'),
    path('history/', views.interview_history, name='interview-history'),
    path('stats/', views.interview_stats, name='interview-stats'),
    
    # Delete session
    path('<uuid:session_id>/', views.delete_interview, name='delete-interview'),
    
    # Audio transcription
    path('transcribe/', views.transcribe_audio, name='transcribe-audio'),
]

