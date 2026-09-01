"use client";

import { useEffect, useId, useRef, useState } from "react";

type ContextGuideProps = {
  guideId: string;
  message: string;
  lightMode: boolean;
};

export function ContextGuide({ guideId, message, lightMode }: ContextGuideProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownId = useId();

  useEffect(() => {
    const storageKey = `bfshop-context-guide-${guideId}`;

    if (window.localStorage.getItem(storageKey) !== "seen") {
      setOpen(true);
      window.localStorage.setItem(storageKey, "seen");
    }
  }, [guideId]);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const control = lightMode
    ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700"
    : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300";
  const dropdown = lightMode
    ? "border-zinc-300 bg-white text-zinc-950"
    : "border-white/15 bg-zinc-900 text-white";
  const muted = lightMode ? "text-zinc-600" : "text-zinc-400";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={dropdownId}
        onClick={() => setOpen((current) => !current)}
        className={`h-9 rounded-md border px-3 font-inter text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${control}`}
      >
        Guide
      </button>

      <div
        id={dropdownId}
        role="dialog"
        aria-hidden={!open}
        className={`absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border p-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-[opacity,transform] duration-200 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${dropdown} ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
      >
        
        <p className={`mt-2 font-inter text-sm leading-relaxed ${muted}`}>{message}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className={`mt-4 font-inter text-xs font-medium ${lightMode ? "text-sky-700 hover:text-sky-900" : "text-sky-300 hover:text-sky-100"}`}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
