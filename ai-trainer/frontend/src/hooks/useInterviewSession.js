// Interview session persistence hook — saves/loads session and all answers to localStorage for page-refresh recovery (fixes BUG-09)

import { useCallback } from 'react';

// ---------------------------------------------------------------------------
// Storage key definitions — single source of truth for all localStorage keys
// No other file should ever call localStorage directly — use this hook only.
// ---------------------------------------------------------------------------
const SESSION_KEY = 'iv_session';
const ANSWER_KEY  = (qId) => `iv_ans_${qId}`;
const INDEX_KEY   = 'iv_current_index';

/**
 * useInterviewSession — all localStorage read/write for the interview module.
 *
 * Returns:
 *   saveSession(sessionId, questions)
 *   loadSession()                       → { sessionId, questions } | null
 *   saveCurrentIndex(index)
 *   loadCurrentIndex()                  → number (default 0)
 *   saveAnswer(questionId, questionText, questionType, answerText)
 *   loadAnswer(questionId)              → stored object | null
 *   loadAllAnswers(questions)           → array of answer objects
 *   clearSession(questions)
 */
export function useInterviewSession() {

  // ---------------------------------------------------------------------------
  // saveSession — persists session ID + questions array, resets index to 0
  // ---------------------------------------------------------------------------
  const saveSession = useCallback((sessionId, questions) => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ sessionId, questions })
    );
    localStorage.setItem(INDEX_KEY, '0');
  }, []);

  // ---------------------------------------------------------------------------
  // loadSession — returns { sessionId, questions } or null on any error
  // ---------------------------------------------------------------------------
  const loadSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // saveCurrentIndex — persists the in-progress question index
  // ---------------------------------------------------------------------------
  const saveCurrentIndex = useCallback((index) => {
    localStorage.setItem(INDEX_KEY, String(index));
  }, []);

  // ---------------------------------------------------------------------------
  // loadCurrentIndex — returns integer index, defaults to 0
  // ---------------------------------------------------------------------------
  const loadCurrentIndex = useCallback(() => {
    const raw = localStorage.getItem(INDEX_KEY);
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  // ---------------------------------------------------------------------------
  // saveAnswer — saves one Q&A entry with timestamp
  // ---------------------------------------------------------------------------
  const saveAnswer = useCallback(
    (questionId, questionText, questionType, answerText) => {
      localStorage.setItem(
        ANSWER_KEY(questionId),
        JSON.stringify({
          questionId,
          questionText,
          questionType,
          answerText,
          timestamp: new Date().toISOString(),
        })
      );
    },
    []
  );

  // ---------------------------------------------------------------------------
  // loadAnswer — returns stored answer object or null
  // ---------------------------------------------------------------------------
  const loadAnswer = useCallback((questionId) => {
    try {
      const raw = localStorage.getItem(ANSWER_KEY(questionId));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // loadAllAnswers — maps over a questions array and returns all stored answers.
  // For any question with no saved answer, returns a safe default object.
  // ---------------------------------------------------------------------------
  const loadAllAnswers = useCallback(
    (questions) => {
      return questions.map((q) => {
        const stored = loadAnswer(q.id);
        if (stored) return stored;

        // Default — question was never answered (e.g. session crashed early)
        return {
          questionId:   q.id,
          questionText: q.question_text || '',
          questionType: q.question_type || '',
          answerText:   '[No answer provided]',
          timestamp:    null,
        };
      });
    },
    [loadAnswer]
  );

  // ---------------------------------------------------------------------------
  // clearSession — removes session key, index key, and ALL per-answer keys
  // Always pass the questions array so every iv_ans_{id} key is cleaned up
  // ---------------------------------------------------------------------------
  const clearSession = useCallback((questions) => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(INDEX_KEY);
    if (Array.isArray(questions)) {
      questions.forEach((q) => localStorage.removeItem(ANSWER_KEY(q.id)));
    }
  }, []);

  return {
    saveSession,
    loadSession,
    saveCurrentIndex,
    loadCurrentIndex,
    saveAnswer,
    loadAnswer,
    loadAllAnswers,
    clearSession,
  };
}
