import {useEffect, useState} from 'react';
import {TypingTextProps} from './types';

const DEFAULT_SPEED_MS = 40;

// Efeito de máquina de escrever — texto puro, sem estilo próprio.
export function TypingText({text, speedMs = DEFAULT_SPEED_MS}: TypingTextProps) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);

    if (!text) {
      return undefined;
    }

    const interval = setInterval(() => {
      setVisibleLength(current => {
        if (current >= text.length) {
          clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs]);

  return <>{text.slice(0, visibleLength)}</>;
}
