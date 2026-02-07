"""
Admin configuration for Interview module.
"""

from django.contrib import admin
from .models import Resume, InterviewSession, InterviewQuestion, InterviewAnswer, InterviewFeedback


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'filename', 'is_parsed', 'created_at']
    list_filter = ['is_parsed', 'created_at']
    search_fields = ['user__username', 'user__email', 'filename']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'interview_type', 'status', 'overall_score', 'created_at']
    list_filter = ['interview_type', 'status', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Session Info', {
            'fields': ('id', 'user', 'resume', 'interview_type', 'status')
        }),
        ('Configuration', {
            'fields': ('total_questions', 'duration_minutes', 'current_question_index')
        }),
        ('Timing', {
            'fields': ('start_time', 'end_time')
        }),
        ('Scores', {
            'fields': ('overall_score', 'communication_score', 'technical_score', 'confidence_score')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'question_number', 'category', 'difficulty', 'created_at']
    list_filter = ['category', 'difficulty', 'created_at']
    search_fields = ['question_text', 'session__user__username']
    readonly_fields = ['id', 'created_at']
    ordering = ['session', 'question_number']


@admin.register(InterviewAnswer)
class InterviewAnswerAdmin(admin.ModelAdmin):
    list_display = ['id', 'question', 'score', 'created_at']
    list_filter = ['score', 'created_at']
    search_fields = ['answer_text', 'question__session__user__username']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']


@admin.register(InterviewFeedback)
class InterviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'overall_rating', 'percentile', 'created_at']
    list_filter = ['overall_rating', 'created_at']
    search_fields = ['session__user__username', 'overall_summary']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']
