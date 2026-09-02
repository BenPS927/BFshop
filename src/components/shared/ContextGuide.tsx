"use client";

import { useEffect, useId, useRef, useState } from "react";

type ContextGuideProps = {
  guideId: string;
  message: string;
  mobileMessage?: string;
  lightMode: boolean;
};

export function ContextGuide({ guideId, message, mobileMessage, lightMode }: ContextGuideProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownId = useId();

  useEffect(() => {
    const storageKey = `bfshop-context-guide-${guideId}`;
    if (window.localStorage.getItem(storageKey) === "seen") return;

    const entranceTimer = window.setTimeout(() => {
      setOpen(true);
      window.localStorage.setItem(storageKey, "seen");
    }, 650);
    return () => window.clearTimeout(entranceTimer);
  }, [guideId]);

  useEffect(() => {
    if (!open) return;

    const dismissalTimer = window.setTimeout(() => setOpen(false), 5000);

    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.clearTimeout(dismissalTimer);
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
    <div ref={containerRef} data-guide-id={guideId} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={dropdownId}
        onClick={() => setOpen((current) => !current)}
        className={`h-11 rounded-md border px-3 font-inter text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${control}`}
      >
        Guide
      </button>

      <div
        id={dropdownId}
        role="dialog"
        aria-hidden={!open}
        className={`absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border p-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-[opacity,transform] duration-[400ms] ease-in-out motion-reduce:translate-y-0 motion-reduce:transition-none ${dropdown} ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        
        <p className={`mt-2 font-inter text-sm leading-relaxed ${muted}`}>
          <span className="sm:hidden">{mobileMessage ?? message}</span>
          <span className="hidden sm:inline">{message}</span>
        </p>
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
