'use client';

import Link from "next/link";
import { useState } from "react";

type DraftBlock = {
  id: number;
  type: "note" | "heading" | "list" | "quote";
  title: string;
  body: string;
};

const starterBlocks: DraftBlock[] = [
  {
    id: 1,
    type: "heading",
    title: "The next BFshop release",
    body: "A rough space for the idea, the audience, and the shape this could take.",
  },
  {
    id: 2,
    type: "note",
    title: "Working note",
    body: "What should this help a merchant do faster? Keep the first pass loose and collect the useful details here.",
  },
];

const blockOptions: Array<{ type: DraftBlock["type"]; label: string; description: string }> = [
  { type: "heading", label: "Heading", description: "Give the draft a clear anchor" },
  { type: "note", label: "Note", description: "Capture an idea or a detail" },
  { type: "list", label: "Checklist", description: "Turn loose thoughts into steps" },
  { type: "quote", label: "Quote", description: "Keep a useful phrase close" },
];

function blockLabel(type: DraftBlock["type"]) {
  return type === "list" ? "CHECKLIST" : type.toUpperCase();
}

function getInitialBlocks() {
  if (typeof window === "undefined") return starterBlocks;

  const savedDraft = window.localStorage.getItem("bfshop-playground-draft");
  if (!savedDraft) return starterBlocks;

  try {
    const parsedDraft = JSON.parse(savedDraft) as DraftBlock[];
    return Array.isArray(parsedDraft) && parsedDraft.length > 0 ? parsedDraft : starterBlocks;
  } catch {
    window.localStorage.removeItem("bfshop-playground-draft");
    return starterBlocks;
  }
}

export default function PlaygroundPage() {
  const [blocks, setBlocks] = useState<DraftBlock[]>(getInitialBlocks);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [saveState, setSaveState] = useState("Saved locally");
  const selectedId = activeId ?? blocks[0]?.id ?? 0;

  function updateBlock(id: number, field: "title" | "body", value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => (block.id === id ? { ...block, [field]: value } : block)),
    );
    setSaveState("Unsaved changes");
  }

  function saveDraft() {
    window.localStorage.setItem("bfshop-playground-draft", JSON.stringify(blocks));
    setSaveState("Saved locally");
  }

  function addBlock(type: DraftBlock["type"]) {
    const newBlock: DraftBlock = {
      id: blocks.reduce((highestId, block) => Math.max(highestId, block.id), 0) + 1,
      type,
      title: type === "list" ? "Things to explore" : "Untitled block",
      body: type === "list" ? "First step\nSecond step\nThird step" : "Start drafting here...",
    };
    setBlocks((currentBlocks) => [...currentBlocks, newBlock]);
    setActiveId(newBlock.id);
    setSaveState("Unsaved changes");
  }

  function removeBlock(id: number) {
    const nextBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(nextBlocks);
    setActiveId(nextBlocks[0]?.id ?? null);
    setSaveState("Unsaved changes");
  }

  return (
    <main className="min-h-screen bg-black bg-[radial-gradient(900px_480px_at_12%_-8%,rgba(56,189,248,0.12),transparent_62%),linear-gradient(180deg,#050505_0%,#0a0a0a_48%,#121212_100%)] text-white">
      <header className="border-b border-white/10 bg-black/25 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="font-bebas text-xl tracking-[0.16em] text-white transition hover:text-sky-400">
              BF<span className="text-sky-400">SHOP</span>
            </Link>
            <span className="h-5 w-px bg-white/15" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-400">Workspace</p>
              <h1 className="truncate font-inter text-sm font-semibold text-zinc-200">Untitled draft</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/playground/customer" className="hidden rounded-lg border border-white/15 px-3 py-2 font-inter text-xs font-medium text-zinc-300 transition hover:border-sky-400/60 hover:text-white sm:block">
              Customer draft
            </Link>
            <span className="hidden font-inter text-xs text-zinc-500 sm:block">{saveState}</span>
            <button type="button" onClick={() => setIsPreview(!isPreview)} className="rounded-lg border border-white/15 px-3 py-2 font-inter text-xs font-medium text-zinc-300 transition hover:border-sky-400/60 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400/80">
              {isPreview ? "Edit draft" : "Preview"}
            </button>
            <button type="button" onClick={saveDraft} className="rounded-lg bg-sky-400 px-3 py-2 font-inter text-xs font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">
              Save draft
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8 lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:px-8 lg:py-10">
        <aside className="order-2 rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.34)] lg:order-1">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-400">Build with blocks</p>
              <h2 className="mt-1 font-inter text-sm font-semibold text-white">Add to draft</h2>
            </div>
            <span className="font-mono text-xs text-zinc-600">{blocks.length.toString().padStart(2, "0")}</span>
          </div>
          <div className="space-y-2">
            {blockOptions.map((option) => (
              <button key={option.type} type="button" onClick={() => addBlock(option.type)} className="group flex w-full items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-left transition hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-sky-400/80">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-white/15 font-mono text-sm text-sky-400 transition group-hover:border-sky-400/60">+</span>
                <span>
                  <span className="block font-inter text-sm font-medium text-zinc-200">{option.label}</span>
                  <span className="mt-1 block font-inter text-[11px] leading-relaxed text-zinc-500">{option.description}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-inter text-xs text-zinc-500">Draft canvas</p>
              <p className="mt-1 font-inter text-sm text-zinc-300">Shape the thought before it becomes a feature.</p>
            </div>
            <span className="hidden rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] text-zinc-500 sm:block">LOCAL ONLY</span>
          </div>
          <div className="min-h-[560px] rounded-2xl border border-white/15 bg-[#f2f0eb] p-4 text-slate-950 shadow-[0_24px_56px_rgba(0,0,0,0.42)] sm:p-7 md:p-10">
            <div className="mx-auto max-w-2xl space-y-4">
              {blocks.map((block, index) => (
                <article key={block.id} onClick={() => setActiveId(block.id)} className={`group relative rounded-xl border p-5 transition ${selectedId === block.id && !isPreview ? "border-sky-500 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.10)]" : "border-transparent hover:border-slate-300"}`}>
                  {!isPreview && <span className="absolute -left-2 -top-2 rounded bg-sky-500 px-1.5 py-1 font-mono text-[9px] text-white opacity-0 transition group-hover:opacity-100">{index + 1}</span>}
                  {!isPreview && <button type="button" aria-label={`Remove ${blockLabel(block.type).toLowerCase()} block`} onClick={(event) => { event.stopPropagation(); removeBlock(block.id); }} className="absolute right-3 top-3 font-mono text-xs text-slate-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100">x</button>}
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">{blockLabel(block.type)}</p>
                  {isPreview ? <h2 className="mt-3 whitespace-pre-wrap font-inter text-xl font-semibold text-slate-900">{block.title}</h2> : <input value={block.title} onChange={(event) => updateBlock(block.id, "title", event.target.value)} className="mt-2 w-full bg-transparent font-inter text-xl font-semibold text-slate-900 outline-none placeholder:text-slate-400" placeholder="Block title" />}
                  {block.type === "list" ? (isPreview ? <ul className="mt-3 list-inside list-disc space-y-2 font-inter text-sm leading-relaxed text-slate-600">{block.body.split("\n").map((item) => <li key={item}>{item}</li>)}</ul> : <textarea value={block.body} onChange={(event) => updateBlock(block.id, "body", event.target.value)} className="mt-3 min-h-24 w-full resize-y bg-transparent font-inter text-sm leading-relaxed text-slate-600 outline-none placeholder:text-slate-400" placeholder="One item per line" />) : isPreview ? <p className="mt-3 whitespace-pre-wrap font-inter text-sm leading-relaxed text-slate-600">{block.body}</p> : <textarea value={block.body} onChange={(event) => updateBlock(block.id, "body", event.target.value)} className="mt-3 min-h-20 w-full resize-y bg-transparent font-inter text-sm leading-relaxed text-slate-600 outline-none placeholder:text-slate-400" placeholder="Write something..." />}
                </article>
              ))}
              {blocks.length === 0 && <button type="button" onClick={() => addBlock("note")} className="w-full rounded-xl border border-dashed border-slate-300 p-10 text-center font-inter text-sm text-slate-500 transition hover:border-sky-500 hover:text-sky-600">+ Add your first block</button>}
            </div>
          </div>
        </section>

        <aside className="order-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:order-3">
          <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-400">Draft details</p>
          <div className="mt-5 space-y-4 font-inter text-sm">
            <div className="border-b border-white/10 pb-4"><p className="text-zinc-500">Status</p><p className="mt-1 text-zinc-200">Exploring</p></div>
            <div className="border-b border-white/10 pb-4"><p className="text-zinc-500">Blocks</p><p className="mt-1 text-zinc-200">{blocks.length} {blocks.length === 1 ? "block" : "blocks"}</p></div>
            <div><p className="text-zinc-500">Storage</p><p className="mt-1 text-zinc-200">This browser</p><p className="mt-2 text-xs leading-relaxed text-zinc-600">Your draft stays on this device until you clear it.</p></div>
          </div>
        </aside>
      </div>
    </main>
  );
}
