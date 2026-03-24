import { useRef, useCallback, useEffect } from 'react';

export const useSilenceDetector = (transcript: string, onSilenceDetected: () => void, silenceThresholdMs: number = 3000) => {
  const timeoutRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);

  const startSilenceDetection = useCallback(() => {
    isActiveRef.current = true;
    resetSilenceTimer();
  }, []);

  const stopSilenceDetection = useCallback(() => {
    isActiveRef.current = false;
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (!isActiveRef.current) return;

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (isActiveRef.current) {
        onSilenceDetected();
      }
    }, silenceThresholdMs);
  }, [onSilenceDetected, silenceThresholdMs]);

  // Auto-reset timer when the user speaks (transcript changes)
  useEffect(() => {
    if (isActiveRef.current) {
      resetSilenceTimer();
    }
  }, [transcript, resetSilenceTimer]);

  // Clean up on component unmount
  useEffect(() => {
    return () => stopSilenceDetection();
  }, [stopSilenceDetection]);

  return { startSilenceDetection, stopSilenceDetection, resetSilenceTimer };
};
