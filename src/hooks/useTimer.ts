import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  /** Start a countdown from `duration` seconds. Calls onComplete when done. */
  startCountdown: (duration: number) => void;
  isCountdown: boolean;
}

export function useTimer(onComplete?: () => void): UseTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownTarget, setCountdownTarget] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // handle countdown completion
  useEffect(() => {
    if (isCountdown && seconds <= 0 && isRunning) {
      pause();
      onComplete?.();
    }
  }, [seconds, isCountdown, isRunning]);

  const start = useCallback(() => {
    if (intervalRef.current) return; // already running

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (isCountdown) {
          return Math.max(0, prev - 1);
        }
        return prev + 1;
      });
    }, 1000);
  }, [isCountdown]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    pause();
    setSeconds(0);
    setIsCountdown(false);
    setCountdownTarget(0);
  }, [pause]);

  const startCountdown = useCallback((duration: number) => {
    // clear any existing timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsCountdown(true);
    setCountdownTarget(duration);
    setSeconds(duration);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
  }, []);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    startCountdown,
    isCountdown,
  };
}
