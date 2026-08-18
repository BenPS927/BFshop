"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useState } from "react";

const boards = [
  {
    id: "orders",
    href: "/merchant/orders",
    title: "Order Hub",
    description: "Manage orders as received, sent or delivered.",
    status: "Awaiting data",
  },
  {
    id: "inventory",
    title: "Data",
    description: "Once AI is integrated, this board will display real-time data.",
    status: "Awaiting data",
  },
  {
    id: "operations",
    title: "Overwatch",
    description: "Eventually this will be the hub for viewing the AI's activity.",
    status: "Awaiting data",
  },
];

type Board = (typeof boards)[number];

function BoardPanel({ board, lightMode }: { board: Board; lightMode: boolean }) {
  const panelClassName = `flex min-h-[calc(100dvh-11.5rem)] flex-col border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 lg:h-full lg:min-h-0 ${
        lightMode
          ? "border-zinc-300 bg-white text-zinc-950"
          : "border-white/15 bg-white/[0.07] text-white"
      }`;

  const panelContent = (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-current/15 pb-4">
        <div>
          <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
            {board.title}
          </h2>
        </div>
        <span
          className={`shrink-0 border px-2 py-1 font-inter text-xs font-medium ${
            lightMode
              ? "border-sky-700/30 bg-sky-50 text-sky-800"
              : "border-sky-400/30 bg-sky-400/10 text-sky-300"
          }`}
        >
          {board.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center py-6">
        <div
          className={`border border-dashed p-4 md:p-6 ${
            lightMode ? "border-zinc-300 bg-zinc-50" : "border-white/15 bg-black/10"
          }`}
        >
          <p
            className={`font-inter text-base leading-relaxed md:text-lg ${
              lightMode ? "text-zinc-700" : "text-zinc-300"
            }`}
          >
            {board.description}
          </p>
        </div>
      </div>
    </>
  );

  if (typeof board.href === "string") {
    return (
      <Link
        href={board.href}
        className={`${panelClassName} transition hover:border-sky-400/60 hover:shadow-[0_20px_48px_rgba(14,165,233,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`}
      >
        {panelContent}
      </Link>
    );
  }

  return <article className={panelClassName}>{panelContent}</article>;
}

export default function MerchantPage() {
  const [lightMode, setLightMode] = useState(false);

  function toggleTheme() {
    setLightMode((currentMode) => {
      const nextMode = !currentMode;
      return nextMode;
    });
  }

  return (
    <main
      className={`min-h-screen px-4 py-6 transition-colors md:px-6 md:py-8 lg:px-8 lg:py-12 ${
        lightMode
          ? "bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(14,165,233,0.12),transparent_60%),linear-gradient(180deg,#F8FAFC_0%,#EAF1F7_100%)] text-zinc-950"
          : "bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#050505_0%,#0A0A0A_45%,#121212_100%)] text-white"
      }`}
    >
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1600px] grid-rows-[auto_1fr] gap-4 pt-3 md:min-h-[calc(100vh-4rem)] md:gap-8 md:pt-0 lg:min-h-[calc(100vh-6rem)] lg:gap-12">
        <header className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 pb-1 md:pb-0">
          <div className="pt-2">
            <Link
              href="/"
              className={`font-inter text-xs font-semibold uppercase tracking-[0.14em] transition ${
                lightMode ? "text-sky-700 hover:text-sky-900" : "text-sky-400 hover:text-sky-300"
              }`}
            >
              BFshop / Merchant
            </Link>
          </div>

          <h1
            className={`border-b p-2 text-center font-bebas text-4xl leading-tight tracking-[0.12em] md:text-5xl lg:p-8 lg:text-6xl ${
              lightMode ? "border-sky-700" : "border-sky-400"
            }`}
          >
            BF <span className={lightMode ? "text-sky-700" : "text-sky-400"}>Merchant</span>
          </h1>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`}
            title={`Switch to ${lightMode ? "dark" : "light"} mode`}
            className={`justify-self-end grid size-11 shrink-0 place-items-center border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
              lightMode
                ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700"
                : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"
            }`}
          >
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </header>

        <div className="mt-1 md:mt-0">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-400 md:hidden">
            <span aria-hidden="true">←</span>
            <span>scroll</span>
            <span aria-hidden="true">→</span>
          </div>

          <div className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:-mr-6 md:gap-6 md:pb-2 lg:mr-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0">
            {boards.map((board) => (
              <div key={board.id} className="w-[calc(100vw-2rem)] shrink-0 snap-center lg:w-auto">
                <BoardPanel board={board} lightMode={lightMode} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}