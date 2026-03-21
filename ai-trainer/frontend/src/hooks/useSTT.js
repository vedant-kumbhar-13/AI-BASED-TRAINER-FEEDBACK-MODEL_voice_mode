// Speech-to-text hook — Web Speech API (browser-native, zero latency); Whisper API as fallback only (fixes BUG-05)

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useSTT — Speech-to-Text hook using window.SpeechRecognition (Web Speech API).
 *
 * Returns:
 *   transcript      {string}   — live transcript (interim + final combined)
 *   isRecording     {boolean}  — true while mic is active
 *   isSupported     {boolean}  — false if browser has no SpeechRecognition API
 *   sttError        {string}   — error code string, or null
 *   startRecording  {fn}       — begins speech recognition
 *   stopRecording   {fn}       — stops recognition, returns final transcript string
 *   resetTranscript {fn}       — clears transcript state and ref
 */
export function useSTT() {
  const [transcript, setTranscript]   = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [sttError, setSttError]       = useState(null);

  // useRef so onend/onerror callbacks always read the latest values
  // without stale closure issues — NOT useState
  const isRecordingRef  = useRef(false);
  const transcriptRef   = useRef('');       // accumulates final results only
  const recognitionRef  = useRef(null);

  // ---------------------------------------------------------------------------
  // On mount: check browser support + build the recognition instance
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    // BUG-05: if neither exists, mark unsupported — caller should show warning
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // -----------------------------------------------------------------------
    // Configuration
    // -----------------------------------------------------------------------
    recognition.lang            = 'en-IN';
    recognition.continuous      = true;
    recognition.interimResults  = true;

    // -----------------------------------------------------------------------
    // onresult — append final results to ref; show live view in state
    // -----------------------------------------------------------------------
    recognition.onresult = (event) => {
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // Append confirmed words to the persistent ref (never lost)
          transcriptRef.current += result[0].transcript + ' ';
        } else {
          // Collect interim words for the live display only
          interimText += result[0].transcript;
        }
      }

      // Display = all confirmed final text + current interim text
      setTranscript((transcriptRef.current + interimText).trim());
    };

    // -----------------------------------------------------------------------
    // onend — auto-restart if isRecordingRef is still true
    // (Chrome stops recognition after ~60s — this keeps it alive)
    // -----------------------------------------------------------------------
    recognition.onend = () => {
      if (isRecordingRef.current) {
        try {
          recognition.start();
        } catch {
          // Ignore 'already started' errors during rapid restarts
        }
      } else {
        setIsRecording(false);
      }
    };

    // -----------------------------------------------------------------------
    // onerror — ignore benign errors; surface real ones
    // -----------------------------------------------------------------------
    recognition.onerror = (event) => {
      const ignoredErrors = ['no-speech', 'aborted'];
      if (ignoredErrors.includes(event.error)) return;

      // Real error — surface to caller
      setSttError(event.error);
      isRecordingRef.current = false;
      setIsRecording(false);
    };

    // Cleanup on unmount
    return () => {
      isRecordingRef.current = false;
      try {
        recognition.stop();
      } catch {
        // Ignore errors if recognition was never started
      }
    };
  }, []); // runs once on mount

  // ---------------------------------------------------------------------------
  // startRecording()
  // ---------------------------------------------------------------------------
  const startRecording = useCallback(() => {
    if (!recognitionRef.current || isRecordingRef.current) return;

    setSttError(null);
    isRecordingRef.current = true;
    setIsRecording(true);

    try {
      recognitionRef.current.start();
    } catch {
      // Already started — safe to ignore
    }
  }, []);

  // ---------------------------------------------------------------------------
  // stopRecording() — returns the final accumulated transcript string
  // IMPORTANT: set ref to false BEFORE calling stop() so onend does NOT restart
  // ---------------------------------------------------------------------------
  const stopRecording = useCallback(() => {
    isRecordingRef.current = false; // must happen BEFORE stop()

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore if already stopped
    }

    setIsRecording(false);

    // Return the final clean transcript to the caller (e.g. for saving)
    return transcriptRef.current.trim();
  }, []);

  // ---------------------------------------------------------------------------
  // resetTranscript() — wipe state and ref
  // ---------------------------------------------------------------------------
  const resetTranscript = useCallback(() => {
    transcriptRef.current = '';
    setTranscript('');
  }, []);

  return {
    transcript,
    isRecording,
    isSupported,
    sttError,
    startRecording,
    stopRecording,
    resetTranscript,
  };
}
