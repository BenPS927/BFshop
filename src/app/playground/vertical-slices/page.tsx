"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";

const slices = [
  { title: "Slice 1: Place Order", description: "The customer end of BFshop, where an order can be placed.", href: "/playground/vertical-slices/slice-1" },
  { title: "Slice 2: Manage Orders", description: "The merchant end of BFshop, where orders can be viewed and managed.", href: "/playground/vertical-slices/slice-2" },
  { title: "Slice 3: Metrics and History", description: "The calculation and storage of business metrics.", href: "/playground/vertical-slices/slice-3" },
  { title: "Slice 4: Findings and Relationships", description: "Deterministic analysis of noteworthy changes, patterns, and relationships.", href: "/playground/vertical-slices/slice-4" },
  { title: "Slice 5: Intelligence Interface", description: "An AI interface for explaining findings, answering questions, and suggesting actions.", href: "/playground/vertical-slices/slice-5" },
];

export default function VerticalSlicesPage() {
  const { lightMode, toggleTheme } = useMerchantTheme();
  const pageBackground = lightMode ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-white";
  const control = lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300";

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors md:px-6 md:py-8 lg:px-8 lg:py-12 ${pageBackground}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-inter text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${control}`}>
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`} title={`Switch to ${lightMode ? "dark" : "light"} mode`} className={`grid size-11 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${control}`}>
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </div>

        <header className="mx-auto mt-12 max-w-4xl text-center md:mt-16">
          <h1 className="font-bebas text-5xl leading-tight tracking-[0.08em] md:text-6xl lg:text-7xl">Vertical slices</h1>
          <p className={`mt-5 font-inter text-base leading-relaxed md:text-lg ${lightMode ? "text-zinc-700" : "text-zinc-300"}`}>Each slice follows a feature through the BFshop interface, backend, and data layer.</p>
        </header>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-5 md:gap-8">
          {slices.map((slice) => (
            <Link key={slice.title} href={slice.href} className={`flex min-h-64 flex-col justify-between rounded-lg border p-6 transition hover:-translate-y-1 hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 md:p-7 ${lightMode ? "border-zinc-300 bg-white" : "border-white/15 bg-white/[0.06]"}`}>
              <div>
                <h1 className={`font-inter text-xl font-semibold leading-snug ${lightMode ? "text-zinc-950" : "text-white"}`}>{slice.title}</h1>
                <p className={`mt-4 font-inter text-sm leading-relaxed ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>{slice.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
