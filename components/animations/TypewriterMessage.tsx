"use client";

import { useEffect, useState } from "react";

interface TypewriterMessageProps {
  message: string;
  onComplete?: () => void;
  speedMs?: number;
  textColor?: string;
}

export function TypewriterMessage({ message, onComplete, speedMs = 18, textColor }: TypewriterMessageProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(message);
      setDone(true);
      onComplete?.();
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(id);
        setDone(true);
        onComplete?.();
      }
    }, speedMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <div className="max-w-md overflow-y-auto pr-1" style={{ maxHeight: "40vh" }}>
      <p className="whitespace-pre-line text-left font-serif text-lg leading-relaxed" style={{ color: textColor }}>
        {shown}
        {!done && <span className="inline-block w-0.5 animate-pulse bg-current align-middle" />}
      </p>
    </div>
  );
}
