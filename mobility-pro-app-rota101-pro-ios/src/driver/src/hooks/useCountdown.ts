import { useEffect, useRef, useState } from 'react';

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function useCountdown(initialSeconds: number, onExpire?: () => void) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    setSecondsRemaining(initialSeconds);
    hasExpiredRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  useEffect(() => {
    if (secondsRemaining > 0 || hasExpiredRef.current) return;

    hasExpiredRef.current = true;
    onExpire?.();
  }, [secondsRemaining, onExpire]);

  return {
    secondsRemaining,
    formattedTime: formatTime(secondsRemaining),
    isExpired: secondsRemaining <= 0,
  };
}
