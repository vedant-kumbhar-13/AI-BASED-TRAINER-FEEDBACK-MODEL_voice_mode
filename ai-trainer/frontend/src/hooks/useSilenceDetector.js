// Silence detection hook — fires onSilence callback after 3s of no new transcript to auto-advance (fixes BUG-08)

import { useRef, useCallback } from 'react';

/**
 * useSilenceDetector — Fires onSilence() after silenceMs of no new speech.
 *
 * @param {Function} onSilence   — callback to invoke when silence is detected
 * @param {number}   silenceMs   — milliseconds of silence before firing (default: 3000)
 *
 * Returns:
 *   startSilenceDetection()  — activate detector and start the timer
 *   stopSilenceDetection()   — deactivate detector and cancel the timer
 *   resetSilenceTimer()      — restart the timer (call on every new transcript chunk)
 */
export function useSilenceDetector(onSilence, silenceMs = 3000) {
  // useRef so timer callbacks always read the latest values — NOT useState
  const timerRef  = useRef(null);
  const activeRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Internal helper — starts a fresh timeout
  // ---------------------------------------------------------------------------
  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (activeRef.current) {
        onSilence();
      }
    }, silenceMs);
  }, [onSilence, silenceMs]);

  // ---------------------------------------------------------------------------
  // startSilenceDetection() — activate and begin the first countdown
  // ---------------------------------------------------------------------------
  const startSilenceDetection = useCallback(() => {
    activeRef.current = true;
    clearTimeout(timerRef.current);
    startTimer();
  }, [startTimer]);

  // ---------------------------------------------------------------------------
  // stopSilenceDetection() — deactivate and cancel any pending timer
  // ---------------------------------------------------------------------------
  const stopSilenceDetection = useCallback(() => {
    activeRef.current = false;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  // ---------------------------------------------------------------------------
  // resetSilenceTimer() — restarts the countdown (call on every new transcript)
  // Only restarts if detection is currently active
  // ---------------------------------------------------------------------------
  const resetSilenceTimer = useCallback(() => {
    if (!activeRef.current) return;
    clearTimeout(timerRef.current);
    startTimer();
  }, [startTimer]);

  return {
    startSilenceDetection,
    stopSilenceDetection,
    resetSilenceTimer,
  };
}
