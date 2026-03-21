// Text-to-speech hook — Web Speech API with Chrome keep-alive ping and onvoiceschanged listener (fixes BUG-06, BUG-07)

import { useEffect, useRef, useCallback } from 'react';

/**
 * useTTS — Text-to-Speech hook using window.speechSynthesis.
 *
 * Returns:
 *   speak(text)   → Promise<void> — reads text aloud, resolves on finish
 *   stopSpeaking() → void         — cancels any ongoing speech
 */
export function useTTS() {
  const synth = useRef(window.speechSynthesis);

  // ---------------------------------------------------------------------------
  // Voice selection — runs once voices are loaded
  // Priority: Google EN voice > en-IN > any EN > default
  // ---------------------------------------------------------------------------
  const getVoice = useCallback(() => {
    const voices = synth.current.getVoices();

    // First pick: Google voice with English language
    const googleEn = voices.find(
      (v) =>
        v.name.includes('Google') &&
        v.lang.toLowerCase().startsWith('en')
    );
    if (googleEn) return googleEn;

    // Second pick: en-IN locale
    const enIN = voices.find((v) => v.lang.toLowerCase().startsWith('en-in'));
    if (enIN) return enIN;

    // Third pick: any English voice
    const anyEn = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    if (anyEn) return anyEn;

    // Fallback: browser default (first voice or null)
    return voices[0] || null;
  }, []);

  // ---------------------------------------------------------------------------
  // BUG-07 FIX: getVoices() returns [] on first load in Chrome.
  // Register onvoiceschanged so we have voices ready before the first speak().
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const s = synth.current;

    // Trigger a no-op load so Chrome populates the voices list early
    if (s.onvoiceschanged !== undefined) {
      s.onvoiceschanged = () => {
        // Voices now populated — nothing else needed here
        s.getVoices();
      };
    }

    // Cleanup: cancel any ongoing speech when the component unmounts
    return () => {
      s.cancel();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // speak(text) — main function
  // ---------------------------------------------------------------------------
  const speak = useCallback(
    (text) => {
      return new Promise((resolve, reject) => {
        // Cancel anything already playing before starting
        synth.current.cancel();

        const utter = new SpeechSynthesisUtterance(text);

        // Voice settings
        utter.rate   = 0.88;
        utter.pitch  = 1.0;
        utter.volume = 1.0;

        // Apply selected voice (may be null if voices not loaded yet — browser uses default)
        const voice = getVoice();
        if (voice) utter.voice = voice;

        // -----------------------------------------------------------------------
        // BUG-06 FIX: Chrome pauses speechSynthesis mid-sentence for long text.
        // Keep-alive: call resume() every 5 seconds if synthesis is paused.
        // -----------------------------------------------------------------------
        const ping = setInterval(() => {
          if (synth.current.paused) {
            synth.current.resume();
          }
        }, 5000);

        // Resolve promise when speech finishes — clear interval to prevent leak
        utter.onend = () => {
          clearInterval(ping);
          resolve();
        };

        // Reject promise on error — clear interval to prevent leak
        utter.onerror = (err) => {
          clearInterval(ping);
          reject(err);
        };

        synth.current.speak(utter);
      });
    },
    [getVoice]
  );

  // ---------------------------------------------------------------------------
  // stopSpeaking() — cancels ongoing speech immediately
  // ---------------------------------------------------------------------------
  const stopSpeaking = useCallback(() => {
    synth.current.cancel();
  }, []);

  return { speak, stopSpeaking };
}
