"""
Whisper Speech-to-Text Service

Handles audio transcription using OpenAI Whisper API.
"""

from openai import OpenAI
from django.conf import settings
import logging
import os
import tempfile

logger = logging.getLogger(__name__)


class WhisperService:
    """
    Service class for audio transcription using OpenAI Whisper.
    """
    
    def __init__(self):
        """Initialize Whisper with API key from environment."""
        api_key = os.environ.get('OPENAI_API_KEY') or getattr(settings, 'OPENAI_API_KEY', None)
        if not api_key:
            logger.warning("OPENAI_API_KEY not found. Voice transcription will fail.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)
        
    def transcribe_audio(self, audio_file) -> dict:
        """
        Transcribe audio file to text using Whisper.
        
        Args:
            audio_file: Audio file object (from request.FILES)
            
        Returns:
            dict with transcription text and success status
        """
        if not self.client:
            return {
                'success': False,
                'error': 'OpenAI API key not configured. Please set OPENAI_API_KEY in environment.',
                'text': ''
            }
            
        try:
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
                for chunk in audio_file.chunks():
                    temp_file.write(chunk)
                temp_path = temp_file.name
            
            try:
                # Transcribe using Whisper
                with open(temp_path, 'rb') as audio:
                    transcript = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio,
                        language="en"
                    )
                
                return {
                    'success': True,
                    'text': transcript.text,
                    'error': None
                }
                
            finally:
                # Clean up temp file
                os.unlink(temp_path)
                
        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            return {
                'success': False,
                'error': f"Transcription error: {str(e)}",
                'text': ''
            }
