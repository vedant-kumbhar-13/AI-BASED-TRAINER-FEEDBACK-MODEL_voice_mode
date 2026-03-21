// Main interview controller — state machine
// This is the top-level orchestrator for the entire interview flow.

import { useState, useEffect, useRef } from 'react';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useTTS }               from '../hooks/useTTS';
import { useSTT }               from '../hooks/useSTT';
import { useSilenceDetector }   from '../hooks/useSilenceDetector';
import { useInterviewSession }  from '../hooks/useInterviewSession';

// ── API service ──────────────────────────────────────────────────────────────
import { startSession, submitAll } from '../services/api/interview';

// ── Components ───────────────────────────────────────────────────────────────
import BrowserCheck    from '../components/interview/BrowserCheck';
import MicPermission   from '../components/interview/MicPermission';
import LoadingScreen   from '../components/interview/LoadingScreen';
import PreBrief        from '../components/interview/PreBrief';
import QuestionCard    from '../components/interview/QuestionCard';
import AnswerReview    from '../components/interview/AnswerReview';
import InterviewResults from './InterviewResults';

// ── Phase constants ──────────────────────────────────────────────────────────
const PHASES = Object.freeze({
  BROWSER_CHECK:   'BROWSER_CHECK',
  MIC_PERMISSION:  'MIC_PERMISSION',
  LOADING_QUESTIONS:'LOADING_QUESTIONS',
  PRE_BRIEF:       'PRE_BRIEF',
  SPEAKING:        'SPEAKING',
  COUNTDOWN:       'COUNTDOWN',
  RECORDING:       'RECORDING',
  SAVING_ANSWER:   'SAVING_ANSWER',
  REVIEW:          'REVIEW',
  SUBMITTING:      'SUBMITTING',
  RESULTS:         'RESULTS',
  ERROR:           'ERROR',
});

/**
 * Interview — main state-machine controller.
 * Props: { resumeId }
 */
export default function Interview({ resumeId }) {
  // ── State ──────────────────────────────────────────────────────────────
  const [phase,       setPhase]       = useState(PHASES.BROWSER_CHECK);
  const [questions,   setQuestions]   = useState([]);
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [sessionId,   setSessionId]   = useState(null);
  const [results,     setResults]     = useState(null);
  const [error,       setError]       = useState(null);
  const [countdown,   setCountdown]   = useState(2);
  const [textFallback,setTextFallback]= useState(false);

  // Stable ref for currentIdx so async callbacks read latest value
  const currentIdxRef = useRef(0);
  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);

  // Stable ref for questions
  const questionsRef = useRef([]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  // Guard: prevent React 18 Strict Mode double-invocation of startInterview()
  const isStartingRef = useRef(false);

  // ── Hooks ──────────────────────────────────────────────────────────────
  const { speak, stopSpeaking } = useTTS();

  const {
    transcript, isRecording, isSupported,
    sttError, startRecording, stopRecording, resetTranscript,
  } = useSTT();

  const {
    startSilenceDetection,
    stopSilenceDetection,
    resetSilenceTimer,
  } = useSilenceDetector(handleSilence, 3000);

  const {
    saveSession, loadSession,
    saveCurrentIndex, loadCurrentIndex,
    saveAnswer, loadAllAnswers, clearSession,
  } = useInterviewSession();

  // ── Effect 1: crash recovery on mount ─────────────────────────────────
  useEffect(() => {
    const saved = loadSession();
    if (saved?.sessionId && Array.isArray(saved.questions) && saved.questions.length > 0) {
      const savedIdx = loadCurrentIndex();
      setSessionId(saved.sessionId);
      setQuestions(saved.questions);
      setCurrentIdx(savedIdx);
      // Jump straight to mic permission — we have questions already
      setPhase(PHASES.MIC_PERMISSION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Effect 2: reset silence timer on new transcript ───────────────────
  useEffect(() => {
    if (phase === PHASES.RECORDING && transcript) {
      resetSilenceTimer();
    }
  }, [transcript]);

  // ── Effect 3: mic permission denied → ERROR ───────────────────────────
  useEffect(() => {
    if (sttError === 'not-allowed') {
      setError('Microphone access was denied. Please allow microphone access and try again.');
      setPhase(PHASES.ERROR);
    }
  }, [sttError]);

  // ── handleSilence — triggered by useSilenceDetector after 3s ──────────
  function handleSilence() {
    if (phase === PHASES.RECORDING) {
      finalizeAnswer();
    }
  }

  // ── runQuestion(index) — async, drives speaking → countdown → recording ─
  async function runQuestion(index) {
    const qs = questionsRef.current;

    // All questions answered → go to review
    if (index >= qs.length) {
      setPhase(PHASES.REVIEW);
      return;
    }

    const q = qs[index];

    // 1. Reset transcript, persist index
    resetTranscript();
    saveCurrentIndex(index);

    // 2. SPEAKING phase — TTS reads the question aloud
    stopSpeaking();
    setPhase(PHASES.SPEAKING);
    try {
      await speak(`Question ${index + 1}. ${q.text || q.question_text}`);
    } catch {
      // TTS failed (no voice available) — skip to countdown
    }

    // 3. COUNTDOWN phase — 2 → 1 → 0
    setPhase(PHASES.COUNTDOWN);
    setCountdown(2);
    await new Promise((resolve) => {
      let count = 2;
      const tick = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(tick);
          resolve();
        }
      }, 900);
    });

    // 4. RECORDING phase — start mic + silence detector
    setPhase(PHASES.RECORDING);
    startRecording();
    startSilenceDetection();
  }

  // ── finalizeAnswer() — called on silence or manual skip ───────────────
  function finalizeAnswer() {
    stopSilenceDetection();
    const finalText = stopRecording();

    const qs  = questionsRef.current;
    const idx = currentIdxRef.current;
    const q   = qs[idx];

    if (q) {
      saveAnswer(
        q.id,
        q.text || q.question_text || '',
        q.type || q.question_type || 'Technical',
        finalText || '[No answer provided]'
      );
    }

    setPhase(PHASES.SAVING_ANSWER);

    setTimeout(() => {
      const nextIdx = idx + 1;
      setCurrentIdx(nextIdx);
      runQuestion(nextIdx);
    }, 800);
  }

  // ── startInterview() — fetch questions from backend ───────────────────
  async function startInterview() {
    // Prevent double-call from React 18 Strict Mode or rapid re-renders
    if (isStartingRef.current) return;
    isStartingRef.current = true;

    setPhase(PHASES.LOADING_QUESTIONS);
    try {
      const data = await startSession(resumeId);
      setSessionId(data.session_id);
      setQuestions(data.questions);
      saveSession(data.session_id, data.questions);
      setCurrentIdx(0);
      setPhase(PHASES.PRE_BRIEF);
    } catch (err) {
      // 409 = active session already exists — clear it and show a clean message
      const serverMsg = err?.message || '';
      if (serverMsg.toLowerCase().includes('active session')) {
        clearSession([]);  // wipe any stale localStorage
        setError(
          'A previous interview session is still active. ' +
          'Click "Try Again" to start fresh — the old session has been cleared.'
        );
      } else {
        setError(serverMsg || 'Failed to start interview.');
      }
      setPhase(PHASES.ERROR);
    } finally {
      isStartingRef.current = false;
    }
  }

  // ── submitInterview() — send all answers to Gemini for evaluation ──────
  async function submitInterview() {
    setPhase(PHASES.SUBMITTING);
    try {
      const allAnswers = loadAllAnswers(questionsRef.current);
      const payload = allAnswers.map(a => ({
        questionId:   a.questionId,
        questionText: a.questionText,
        questionType: a.questionType,
        answerText:   a.answerText,
      }));
      const evaluation = await submitAll(sessionId, payload);
      clearSession(questionsRef.current);
      setResults(evaluation);
      setPhase(PHASES.RESULTS);
    } catch (err) {
      // Answers are still in localStorage — user can retry
      const msg = err?.response?.data?.error || err.message || 'Submission failed. Your answers are saved.';
      setError(msg);
      setPhase(PHASES.ERROR);
    }
  }

  // ── handleReRecord(index) — jump back to record a specific question ────
  function handleReRecord(index) {
    setCurrentIdx(index);
    runQuestion(index);
  }

  // ── Shared page wrapper ────────────────────────────────────────────────
  const Wrap = ({ children }) => <>{children}</>;

  // ── RENDER — phase switch ──────────────────────────────────────────────
  switch (phase) {

    case PHASES.BROWSER_CHECK:
      return (
        <BrowserCheck
          onContinue={() => setPhase(PHASES.MIC_PERMISSION)}
          onFallback={() => {
            setTextFallback(true);
            setPhase(PHASES.MIC_PERMISSION);
          }}
        />
      );

    case PHASES.MIC_PERMISSION:
      return (
        <MicPermission
          onGranted={() => startInterview()}
          onDenied={() => {
            setError('Microphone access is required for the voice interview.');
            setPhase(PHASES.ERROR);
          }}
        />
      );

    case PHASES.LOADING_QUESTIONS:
      return <LoadingScreen message="Generating your personalised questions…" />;

    case PHASES.PRE_BRIEF:
      return (
        <PreBrief
          questions={questions}
          onBegin={() => runQuestion(0)}
        />
      );

    case PHASES.SPEAKING:
    case PHASES.COUNTDOWN:
    case PHASES.RECORDING:
    case PHASES.SAVING_ANSWER:
      return (
        <QuestionCard
          phase={phase.toLowerCase()}
          question={questions[currentIdx] || {}}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          transcript={transcript}
          countdown={countdown}
          onSkip={finalizeAnswer}
        />
      );

    case PHASES.REVIEW:
      return (
        <AnswerReview
          questions={questions}
          sessionId={sessionId}
          onSubmit={submitInterview}
          onReRecord={handleReRecord}
        />
      );

    case PHASES.SUBMITTING:
      return <LoadingScreen message="Analysing your interview… this takes 20–30 seconds." />;

    case PHASES.RESULTS:
      return <InterviewResults results={results} />;

    case PHASES.ERROR:
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh',
          background: 'linear-gradient(135deg,#0f172a,#1e293b)',
          fontFamily: "'Inter','Segoe UI',sans-serif", padding: '24px',
        }}>
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '20px', padding: '40px', maxWidth: '480px', width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#f87171', fontWeight: '700', fontSize: '20px', marginBottom: '12px' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#fca5a5', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
              {error || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={async () => {
                // Mark any stuck in_progress session as abandoned via backend
                // (best effort — ignore errors)
                setError(null);
                isStartingRef.current = false;  // reset guard so startInterview can run again
                setPhase(PHASES.BROWSER_CHECK);
              }}
              style={{
                padding: '12px 28px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
              }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
