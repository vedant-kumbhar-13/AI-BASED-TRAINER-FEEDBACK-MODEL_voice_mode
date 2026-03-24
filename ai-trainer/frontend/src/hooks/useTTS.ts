import { useState, useCallback, useEffect, useRef } from 'react';

export const useTTS = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const keepAliveIntervalId = useRef<number | null>(null);

  useEffect(() => {
    const performVoiceLoad = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    performVoiceLoad();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = performVoiceLoad;
    }

    return () => {
      stopSpeaking();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const getBestVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // Preference: Google voices -> en-IN -> en -> first available
    const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
    if (googleVoice) return googleVoice;

    const indianVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN');
    if (indianVoice) return indianVoice;

    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) return englishVoice;

    return voices[0];
  }, [voices]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    if (keepAliveIntervalId.current !== null) {
      clearInterval(keepAliveIntervalId.current);
      keepAliveIntervalId.current = null;
    }
  }, []);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    stopSpeaking();

    if (!text || voices.length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance; // Prevent garbage collection!

    const bestVoice = getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Chrome bug workaround for long texts pausing mid-sentence
    keepAliveIntervalId.current = window.setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAliveIntervalId.current!);
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 5000);

    utterance.onend = () => {
      if (keepAliveIntervalId.current) {
        clearInterval(keepAliveIntervalId.current);
        keepAliveIntervalId.current = null;
      }
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      if (keepAliveIntervalId.current) {
        clearInterval(keepAliveIntervalId.current);
        keepAliveIntervalId.current = null;
      }
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  }, [voices, getBestVoice, stopSpeaking]);

  return { speak, stopSpeaking };
};
