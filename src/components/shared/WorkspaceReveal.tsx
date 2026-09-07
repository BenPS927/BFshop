"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function WorkspaceReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    timeoutRef.current = window.setTimeout(() => setVisible(true), 150);

    return () => {
      if (timeoutRef.current !== undefined) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`min-w-0 transition-[opacity,transform] duration-500 ease-in-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
