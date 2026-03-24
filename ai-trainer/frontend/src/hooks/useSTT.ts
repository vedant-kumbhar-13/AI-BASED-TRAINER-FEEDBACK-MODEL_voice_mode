import { useState, useCallback, useRef, useEffect } from 'react';

// TypeScript interfaces for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}

export const useSTT = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fullTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognitionModule = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionModule) {
      recognitionRef.current = new SpeechRecognitionModule();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // Indian English accent preference

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript !== '') {
          fullTranscriptRef.current += finalTranscript + ' ';
        }
        
        // Output the combined final + current interim
        setTranscript(fullTranscriptRef.current + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("STT Error:", event.error);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setIsRecording(false);
        }
      };

      recognitionRef.current.onend = () => {
        // Automatically restart if it is supposed to be recording but stopped abruptly
        if (isRecording && recognitionRef.current) {
             try {
                 recognitionRef.current.start();
             } catch(e) { /* ignore */ }
        } else {
            setIsRecording(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start recording", e);
      }
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      setIsRecording(false); 
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  const resetTranscript = useCallback(() => {
    fullTranscriptRef.current = '';
    setTranscript('');
  }, []);

  return { transcript, isRecording, startRecording, stopRecording, resetTranscript };
};
