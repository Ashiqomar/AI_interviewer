import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceRecognitionOptions {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [hasSupport, setHasSupport] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      setError('Web Speech API is not supported in this browser. You can still type your responses.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      startTimeRef.current = Date.now();

      timerIntervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setDurationSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    };

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalStr += text + ' ';
        } else {
          interimStr += text;
        }
      }

      if (finalStr) {
        setTranscript((prev) => {
          const updated = (prev + ' ' + finalStr).trim();
          if (options.onResult) options.onResult(updated);
          return updated;
        });
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Microphone error: ${event.error}`);
      }
      setIsListening(false);
      clearInterval(timerIntervalRef.current);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      clearInterval(timerIntervalRef.current);
      if (options.onEnd) options.onEnd();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized or supported.');
      return;
    }
    setTranscript('');
    setInterimTranscript('');
    setDurationSeconds(0);
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Could not start speech recognition:', err);
      // Might already be running
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      } catch (_) {}
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    clearInterval(timerIntervalRef.current);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setDurationSeconds(0);
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    durationSeconds,
    error,
    hasSupport,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript
  };
}
