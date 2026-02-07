import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '../components/dashboard/Navigation';
import { Send, Mic, MicOff, Clock, Loader2, SkipForward, X, Volume2, VolumeX } from 'lucide-react';
import InterviewAPI from '../services/interviewAPI';
import type { InterviewQuestion, InterviewSession } from '../services/interviewAPI';

export const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state?.config || { interviewType: 'Technical', numQuestions: 5 };
  const resume = location.state?.resume;

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  
  // Audio states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Start interview on mount
  useEffect(() => {
    startInterview();
    return () => {
      // Cleanup speech on unmount
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!isLoading && session) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoading, session]);

  // Auto-speak question when it changes
  useEffect(() => {
    if (currentQuestion && ttsEnabled && !isLoading) {
      speakQuestion(currentQuestion.question_text);
    }
  }, [currentQuestion?.id, ttsEnabled, isLoading]);

  // Text-to-Speech function
  const speakQuestion = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
                      || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleTts = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setTtsEnabled(!ttsEnabled);
  };

  // Speech-to-Text functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Try Whisper API first
      const result = await InterviewAPI.transcribeAudio(audioBlob);
      
      if (result.success && result.text) {
        // Append transcribed text to existing answer
        setAnswer(prev => prev ? `${prev} ${result.text}` : (result.text || ''));
      } else {
        // Fallback: Use browser's Speech Recognition if available
        console.warn('Whisper transcription failed, using browser fallback');
        setError('Voice transcription unavailable. Please type your answer.');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio. Please type your answer.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startInterview = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await InterviewAPI.startInterview({
        interview_type: config.interviewType,
        resume_id: resume?.id,
        total_questions: config.numQuestions
      });

      if (result.success && result.session) {
        setSession(result.session);
        if (result.current_question) {
          setCurrentQuestion(result.current_question);
        }
      } else {
        setError(result.error || 'Failed to start interview');
      }
    } catch (err) {
      setError('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !session || !currentQuestion) return;

    setIsSubmitting(true);
    setError('');
    stopSpeaking(); // Stop any ongoing speech

    try {
      const result = await InterviewAPI.submitAnswer({
        session_id: session.id,
        question_id: currentQuestion.id,
        answer_text: answer,
        answer_duration_seconds: timer
      });

      if (result.success) {
        // Store answer feedback
        setAnswers(prev => [...prev, {
          question: currentQuestion,
          answer: answer,
          feedback: result.answer
        }]);

        if (result.is_last_question) {
          // End interview
          const endResult = await InterviewAPI.endInterview(session.id);
          if (endResult.success) {
            navigate('/ai-interview-feedback', {
              state: {
                session: endResult.session,
                feedback: endResult.feedback,
                answers: [...answers, { question: currentQuestion, answer, feedback: result.answer }]
              }
            });
          }
        } else if (result.next_question) {
          setCurrentQuestion(result.next_question);
          setAnswer('');
          setTimer(0);
        }
      } else {
        setError(result.error || 'Failed to submit answer');
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipQuestion = async () => {
    if (!session || !currentQuestion) return;
    
    // Submit empty answer to skip
    setAnswer('I would like to skip this question.');
    await handleSubmitAnswer();
  };

  const handleExitInterview = () => {
    stopSpeaking();
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate('/ai-interview');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Preparing Your Interview...</h2>
            <p className="text-gray-500">The AI is generating personalized questions</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-full">
                {config.interviewType}
              </span>
              <span className="text-gray-500">
                Question {currentQuestion?.question_number || 1} of {config.numQuestions}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timer)}</span>
              </div>
              <button
                onClick={handleExitInterview}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: config.numQuestions }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < (currentQuestion?.question_number || 1) - 1
                    ? 'bg-green-500'
                    : i === (currentQuestion?.question_number || 1) - 1
                    ? 'bg-primary w-8'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Main Interview Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
            {/* Question Section */}
            <div className="p-8 border-b border-gray-200 bg-gray-50">
              <div className="flex items-start gap-6">
                {/* AI Avatar */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-white border-2 border-primary flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
                
                {/* Question */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs text-gray-400">AI Interviewer</p>
                    {/* TTS Controls */}
                    <button
                      onClick={() => speakQuestion(currentQuestion?.question_text || '')}
                      disabled={isSpeaking}
                      className={`p-1 rounded-full transition-all ${
                        isSpeaking 
                          ? 'bg-primary text-white animate-pulse' 
                          : 'hover:bg-gray-200 text-gray-500'
                      }`}
                      title="Listen to question"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={toggleTts}
                      className={`p-1 rounded-full transition-all ${
                        ttsEnabled ? 'text-gray-500' : 'text-red-500'
                      } hover:bg-gray-200`}
                      title={ttsEnabled ? 'Disable auto-read' : 'Enable auto-read'}
                    >
                      {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {currentQuestion?.question_text || 'Loading question...'}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs text-gray-400">
                      Category: {currentQuestion?.category || 'General'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Suggested time: ~{Math.floor((currentQuestion?.suggested_time_seconds || 120) / 60)} min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-bold text-gray-700">Your Response</span>
                <button
                  onClick={toggleRecording}
                  disabled={isTranscribing}
                  className={`p-2 rounded-full transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : isTranscribing
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                {isRecording && (
                  <span className="text-sm text-red-500 animate-pulse">Recording... Click mic to stop</span>
                )}
                {isTranscribing && (
                  <span className="text-sm text-yellow-600 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transcribing...
                  </span>
                )}
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use the mic button to speak... Be specific and use examples from your experience."
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-800"
              />

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">
                  {answer.length}/800 characters
                </span>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSkipQuestion}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                  
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || isSubmitting}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      answer.trim() && !isSubmitting
                        ? 'bg-primary hover:bg-primary-dark text-white shadow-button'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Answer
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Use the 🎤 mic button to speak your answer, or type directly. The question will be read aloud automatically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSessionPage;
