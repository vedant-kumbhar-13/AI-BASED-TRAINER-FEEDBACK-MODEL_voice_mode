import { useCallback } from 'react';

export interface SavedAnswer {
  questionId: string;
  questionIndex: number;
  answerText: string;
}

export interface SessionBackup {
  sessionId: string;
  resumeId: string;
  interviewType: string;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const STORAGE_KEY_SESSION = 'interview_session_backup';
const STORAGE_KEY_ANSWERS = 'interview_session_answers';

export const useInterviewSession = () => {
  const saveSession = useCallback((sessionId: string, sessionData: Omit<SessionBackup, 'sessionId'>) => {
    const backup: SessionBackup = { sessionId, ...sessionData };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(backup));
  }, []);

  const loadSession = useCallback ((): SessionBackup | null => {
    const item = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!item) return null;
    try {
      return JSON.parse(item) as SessionBackup;
    } catch {
      return null;
    }
  }, []);

  const saveAnswer = useCallback((sessionId: string, answer: SavedAnswer) => {
    const key = `${STORAGE_KEY_ANSWERS}_${sessionId}`;
    const raw = localStorage.getItem(key);
    let answers: SavedAnswer[] = [];
    if (raw) {
      try { answers = JSON.parse(raw); } catch { /* ignore */ }
    }
    
    // Replace if exists, otherwise append
    const existingIndex = answers.findIndex(a => a.questionId === answer.questionId);
    if (existingIndex >= 0) {
      answers[existingIndex] = answer;
    } else {
      answers.push(answer);
    }
    
    localStorage.setItem(key, JSON.stringify(answers));
  }, []);

  const loadAllAnswers = useCallback((sessionId: string): SavedAnswer[] => {
    const key = `${STORAGE_KEY_ANSWERS}_${sessionId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SavedAnswer[];
    } catch {
      return [];
    }
  }, []);

  const clearSession = useCallback((sessionId: string) => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(`${STORAGE_KEY_ANSWERS}_${sessionId}`);
  }, []);

  return { saveSession, loadSession, saveAnswer, loadAllAnswers, clearSession };
};
