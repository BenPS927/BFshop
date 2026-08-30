"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";
import type { AnalysisRequest, Filter, Metric } from "../../types/analysisMachine";

const portalAreas = [
  {
    title: "Project Introduction",
    description: "Read to understand the project's vision and architecture.",
    href: "/playground/introduction",
    size: "small",
  },
  {
    title: "Analysis machine",
    href: "",
    size: "main",
  },
  {
    title: "Project notes",
    description: "See the thinking, experiments, and unfinished edges behind BFshop.",
    href: "/playground",
    size: "small",
  },
] as const;

const allMetrics: Metric[] = ["revenue", "sales", "customers", "orders", "itemsSold"];

type FilterDraft =
  | { id: string; category: "gender"; value: string }
  | { id: string; category: "age"; min: string; max: string }
  | { id: string; category: "location"; value: string };

function newFilterDraft(category: FilterDraft["category"]): FilterDraft {
  const id = crypto.randomUUID();
  if (category === "gender") return { id, category, value: "" };
  if (category === "age") return { id, category, min: "", max: "" };
  return { id, category, value: "" };
}

function toFilter(draft: FilterDraft): Filter | null {
  if (draft.category === "gender") return draft.value ? { category: "gender", parameters: draft.value } : null;
  if (draft.category === "age") {
    return draft.min !== "" && draft.max !== ""
      ? { category: "age", parameters: [Number(draft.min), Number(draft.max)] }
      : null;
  }
  return draft.value ? { category: "location", parameters: draft.value } : null;
}

function AnalysisMachinePanel({ lightMode }: { lightMode: boolean }) {
  const [metrics, setMetrics] = useState<Record<Metric, boolean>>({
    revenue: true,
    sales: false,
    customers: false,
    orders: false,
    itemsSold: false,
  });
  const [periodEnabled, setPeriodEnabled] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterDrafts, setFilterDrafts] = useState<FilterDraft[]>([]);
  const [output, setOutput] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const request = useMemo<AnalysisRequest>(() => {
    const selectedMetrics = allMetrics.filter((metric) => metrics[metric]);
    const built: AnalysisRequest = { metrics: selectedMetrics };
    if (periodEnabled && startDate && endDate) {
      built.period = {
        dateRange: [startDate, endDate],
        interval: "day",
      };
    }
    const filters = filterDrafts.map(toFilter).filter((filter): filter is Filter => filter !== null);
    if (filters.length > 0) built.filters = filters;
    return built;
  }, [metrics, periodEnabled, startDate, endDate, filterDrafts]);

  function toggleMetric(metric: Metric) {
    setMetrics((current) => ({ ...current, [metric]: !current[metric] }));
  }

  function updateFilter(id: string, updates: Partial<FilterDraft>) {
    setFilterDrafts((current) => current.map((draft) => (draft.id === id ? ({ ...draft, ...updates } as FilterDraft) : draft)));
  }

  async function runAnalysis() {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    try {
      const response = await fetch("/api/merchant/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to run analysis");
      setOutput(result);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Invalid request");
    } finally {
      setIsRunning(false);
    }
  }

  const panel = lightMode ? "border-zinc-300 bg-white text-zinc-950" : "border-white/15 bg-white/[0.07] text-white";
  const muted = lightMode ? "text-zinc-600" : "text-zinc-400";
  const field = lightMode ? "border-zinc-300 bg-zinc-50 text-zinc-950 placeholder:text-zinc-400" : "border-white/15 bg-black/20 text-white placeholder:text-zinc-500";
  const chip = lightMode ? "border-zinc-300 bg-zinc-50 text-zinc-800" : "border-white/15 bg-black/20 text-zinc-200";

  return (
    <article className={`min-h-[520px] rounded-lg border p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 lg:grid lg:grid-cols-2 lg:gap-8 ${panel}`}>
      <header className="mb-8 text-center lg:col-span-2 lg:mb-0">
        <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">Analysis Machine </h2>
        <p className={`mt-2 font-inter text-sm leading-relaxed ${muted}`}>Construct a request by selecting a metric and adding filters. the right box will show you the output directly from the database.</p>
      </header>
      <section className="flex min-w-0 flex-col">
      
        

      <div className="mb-5">
        <p className={`mb-2 font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>Metrics</p>
        <div className="flex flex-wrap gap-2">
          {allMetrics.map((metric) => (
            <button key={metric} type="button" onClick={() => toggleMetric(metric)} className={`rounded-full border px-3 py-1.5 font-inter text-sm transition ${metrics[metric] ? "border-sky-400 bg-sky-500/20 text-sky-500" : chip}`}>
              {metric}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className={`flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>
          <input type="checkbox" checked={periodEnabled} onChange={(event) => setPeriodEnabled(event.target.checked)} />
          Date range
        </label>
        {periodEnabled && (
          <div className="mt-2 grid grid-cols-2 gap-3">
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={`min-w-0 rounded-md border p-2 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={`min-w-0 rounded-md border p-2 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
          </div>
        )}
      </div>

      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className={`font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>Filters</p>
          <div className="flex flex-wrap gap-2">
            {(["gender", "age", "location"] as const).map((category) => (
              <button key={category} type="button" onClick={() => setFilterDrafts((current) => [...current, newFilterDraft(category)])} className={`rounded-md border px-2 py-1 font-inter text-xs ${chip} hover:border-sky-400 hover:text-sky-500`}>+ {category}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {filterDrafts.map((draft) => (
            <div key={draft.id} className={`flex flex-nowrap items-center gap-2 rounded-md border p-2 ${chip}`}>
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-sky-500">{draft.category}</span>
              {draft.category === "gender" && <input placeholder="e.g. female" value={draft.value} onChange={(event) => updateFilter(draft.id, { value: event.target.value })} className={`min-w-0 flex-1 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />}
              {draft.category === "age" && <><input type="number" placeholder="min" value={draft.min} onChange={(event) => updateFilter(draft.id, { min: event.target.value })} className={`w-24 min-w-0 flex-1 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} /><input type="number" placeholder="max" value={draft.max} onChange={(event) => updateFilter(draft.id, { max: event.target.value })} className={`w-24 min-w-0 flex-1 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} /></>}
              {draft.category === "location" && <input placeholder="e.g. Austin" value={draft.value} onChange={(event) => updateFilter(draft.id, { value: event.target.value })} className={`min-w-0 flex-1 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />}
              <button type="button" onClick={() => setFilterDrafts((current) => current.filter((entry) => entry.id !== draft.id))} className="font-inter text-xs text-rose-400 hover:text-rose-300">Remove</button>
            </div>
          ))}
          {filterDrafts.length === 0 && <p className={`font-inter text-sm ${muted}`}>No filters added.</p>}
        </div>
      </div>

      <details className="mb-4">
        <summary className={`cursor-pointer font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>Request preview</summary>
        <pre className={`mt-2 max-h-32 overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed ${field}`}>{JSON.stringify(request, null, 2)}</pre>
      </details>

      <div className="mt-auto flex flex-wrap items-center gap-4">
        <button type="button" onClick={runAnalysis} disabled={isRunning} className="rounded-md bg-sky-500 px-4 py-3 font-inter text-sm font-semibold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-wait disabled:opacity-60">{isRunning ? "Running..." : "Run analysis"}</button>
        {error && <p className="font-inter text-sm text-rose-400">{error}</p>}
      </div>
      </section>
      <section className="mt-8 flex min-w-0 flex-col border-t border-current/15 pt-6 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
        
        <pre className={`min-h-64 flex-1 overflow-auto rounded-md border p-4 font-mono text-xs leading-relaxed ${field}`}>
          {error ? <span className="text-rose-400">{error}</span> : output === null ? <span className={muted}>Run a request to see its output.</span> : JSON.stringify(output, null, 2)}
        </pre>
      </section>
    </article>
  );
}

export default function BlankPlaygroundPage() {
  const { lightMode, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors md:px-6 md:py-8 lg:px-8 lg:py-12 ${lightMode ? "bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(14,165,233,0.12),transparent_60%),linear-gradient(180deg,#F8FAFC_0%,#EAF1F7_100%)] text-zinc-950" : "bg-[radial-gradient(900px_520px_at_86%_4%,rgba(14,165,233,0.13),transparent_62%),radial-gradient(760px_460px_at_8%_42%,rgba(255,255,255,0.05),transparent_64%),linear-gradient(180deg,#050505_0%,#0a0a0a_52%,#121212_100%)] text-white"}`}>
      <div className="mx-auto max-w-none">
        <div className="flex items-center justify-between">
          <a
            href="https://benfosterdev.com/"
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-inter text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`}
            title={`Switch to ${lightMode ? "dark" : "light"} mode`}
            className={`grid size-11 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}
          >
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </div>

        <header className={`mx-auto max-w-6xl border-b pb-8 text-center md:pb-10 lg:pb-12 ${lightMode ? "border-zinc-300" : "border-white/15"}`}>
          <div>
            <h1 className="font-bebas text-4xl leading-tight tracking-[0.08em] md:text-5xl lg:text-6xl">BFshop</h1>
          </div>
          <div className={`mt-4 font-inter text-base leading-relaxed md:mt-6 md:text-lg ${lightMode ? "text-zinc-700" : "text-zinc-300"}`}>
            BFshop is an under-construction simulated ecommerce business used to develop an intelligence system that identifies what matters, explains it simply and suggests what to do next — without swamping the merchant with analytics dashboards.
          </div>
         
          <div className={`mt-4 font-inter text-sm leading-relaxed md:text-base ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
            Beneath is a copy of the main interface of BFshop, which will be continually updated as the project progresses.
          </div>
        </header>

        <div className={`mx-auto mt-8 max-w-6xl text-center font-inter text-sm leading-relaxed md:mt-10 md:text-base ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
          The first iteration of the analysis machine that will underlie the BFshop. You can filter what data to ask for and this comes directly from the database. This will eventually be an AI chat interface presenting insights on the simulated business, and offering suggestions. 
        </div>

        <section className="mt-8 grid gap-20 md:mt-10 md:grid-cols-2 md:gap-24 lg:mt-16 lg:grid-cols-[296px_minmax(0,1fr)_296px] lg:items-stretch lg:gap-12" aria-label="BFshop project areas">
          {portalAreas.map((area) => (
            area.title === "Analysis machine" ? (
              <AnalysisMachinePanel key={area.title} lightMode={lightMode} />
            ) : area.title === "Project notes" ? (
              <div
                key={area.title}
                className={`grid min-h-52 gap-4 rounded-lg border p-4 lg:mt-24 lg:h-[300px] lg:min-h-0 lg:self-start ${lightMode ? "border-zinc-300 bg-white" : "border-white/15 bg-white/[0.06]"}`}
              >
                <Link
                  href="/merchant"
                  className={`flex min-h-0 flex-col justify-center rounded-md border p-4 transition hover:border-sky-400/60 ${lightMode ? "border-zinc-200 bg-zinc-50 hover:bg-sky-50" : "border-white/10 bg-black/10 hover:bg-white/[0.08]"}`}
                >
                  <h2 className={`font-inter text-lg font-semibold leading-snug ${lightMode ? "text-zinc-950" : "text-white"}`}>Merchant</h2>
                  <p className={`mt-2 font-inter text-sm leading-relaxed ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>Enter the merchant workspace for order management and the home of the analysis machine</p>
                </Link>
                <Link
                  href="/customer"
                  className={`flex min-h-0 flex-col justify-center rounded-md border p-4 transition hover:border-sky-400/60 ${lightMode ? "border-zinc-200 bg-zinc-50 hover:bg-sky-50" : "border-white/10 bg-black/10 hover:bg-white/[0.08]"}`}
                >
                  <h2 className={`font-inter text-lg font-semibold leading-snug ${lightMode ? "text-zinc-950" : "text-white"}`}>Customer</h2>
                  <p className={`mt-2 font-inter text-sm leading-relaxed ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>Click here to enter the customer shop for placing orders into the BFshop eco-system</p>
                </Link>
              </div>
            ) : (
              <Link
                key={area.title}
                href={area.href}
                className={`group flex min-h-52 flex-col justify-between rounded-lg border p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition duration-200 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/80 md:p-8 lg:mt-24 lg:h-[300px] lg:min-h-0 lg:self-start ${lightMode ? "border-zinc-300 bg-white hover:border-sky-600/60 hover:bg-sky-50" : "border-white/15 bg-white/[0.06] hover:border-sky-400/60 hover:bg-white/[0.1] hover:shadow-[0_24px_56px_rgba(0,0,0,0.42)]"}`}
              >
                <div>
                  <h2 className={`mt-6 font-inter text-xl font-semibold leading-snug md:text-2xl ${lightMode ? "text-zinc-950" : "text-white"}`}>
                    {area.title}
                  </h2>
                  <p className={`mt-3 max-w-md font-inter text-sm leading-relaxed md:text-base ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
                    {area.description}
                  </p>
                </div>
              </Link>
            )
          ))}
        </section>
      </div>

      <section className={`-mx-4 mt-24 px-4 py-12 md:-mx-6 md:px-6 md:py-16 lg:-mx-8 lg:mt-32 lg:px-8 lg:py-20 ${lightMode ? "bg-white text-zinc-950" : "bg-white text-zinc-950"}`} aria-labelledby="documentation-title">
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-3xl text-center">
            <h1 id="documentation-title" className="font-bebas text-4xl leading-tight tracking-[0.08em] md:text-5xl lg:text-6xl">Architecture</h1>
            <p className="mt-4 font-inter text-base leading-relaxed text-zinc-600 md:mt-6 md:text-lg">BFshop is a simulated eCommerce business, with a customer interface for placing orders and a merchant interface for managing orders. The merchant interface also includes a section for presenting the findings of the data analysis. This will be presented by a chatbot, which can be conversed with on the findings.</p>
            <br />
            <p className="mt-4 font-inter text-base leading-relaxed text-zinc-600 md:mt-6 md:text-lg">Read how I'm achieving that below.</p>
          </header>

          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
            <Link href="/playground/vertical-slices" className="flex min-h-44 flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-400 md:p-6">
              <h2 className="font-inter text-lg font-semibold leading-snug text-zinc-950 md:text-xl">Vertical Slices</h2>
              <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-600">Documentation on how each segment of the project is built</p>
            </Link>
            <div className="flex min-h-44 flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:p-6">
              <h2 className="font-inter text-lg font-semibold leading-snug text-zinc-950 md:text-xl">Dev Log</h2>
              <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-600">Ongoing updates on the project's development</p>
            </div>
            <div className="flex min-h-44 flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:p-6">
              <h2 className="font-inter text-lg font-semibold leading-snug text-zinc-950 md:text-xl">Synthetic Economy</h2>
              <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-600">Details on how a synthetic economy is used to generate data for analysis</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
