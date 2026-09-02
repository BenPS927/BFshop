"use client";

import { useMemo, useState } from "react";
import { useMerchantTheme } from "../useMerchantTheme";
import type { AnalysisRequest, Filter, Metric } from "@/app/types/slice3MetricsAndHistory/analysisRequest";
import type { ResultsContract } from "@/app/types/slice3MetricsAndHistory/resultsContract";
import { RevenueCharts } from "@/components/merchant/data/RevenueCharts";
import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";
import { syntheticSuburbs } from "@/data/syntheticEconomy/locations";

const allMetrics = ["revenue", "orders", "itemsSold"] as const satisfies readonly Metric[];
type AvailableMetric = (typeof allMetrics)[number];

const intelligenceInterfaceSubtitle = "This is the current state of the Intelligence interface. Right now it is can filter metrics by gender, age and location. Keep checking back here to watch it evolve.";
const intelligenceInterfaceMobileSubtitle = "Query BFshop metrics by gender, age and location.";

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
  if (draft.category === "gender") {
    return draft.value ? { category: "gender", parameters: draft.value } : null;
  }
  if (draft.category === "age") {
    const min = Number(draft.min);
    const max = Number(draft.max);
    return draft.min !== "" && draft.max !== "" ? { category: "age", parameters: [min, max] } : null;
  }
  return draft.value ? { category: "location", parameters: draft.value } : null;
}

export default function MerchantDataPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();
  const [metrics, setMetrics] = useState<Record<AvailableMetric, boolean>>({
    revenue: true,
    orders: false,
    itemsSold: false,
  });
  const [periodEnabled, setPeriodEnabled] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterDrafts, setFilterDrafts] = useState<FilterDraft[]>([]);
  const [output, setOutput] = useState<ResultsContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const request = useMemo<AnalysisRequest>(() => {
    const selectedMetrics = allMetrics.filter((metric) => metrics[metric]);
    const built: AnalysisRequest = { metrics: selectedMetrics };

    if (periodEnabled && startDate && endDate) {
      built.period = { dateRange: [startDate, endDate], interval: "day" };
    }

    const filters = filterDrafts.map(toFilter).filter((filter): filter is Filter => filter !== null);
    if (filters.length > 0) {
      built.filters = filters;
    }

    return built;
  }, [metrics, periodEnabled, startDate, endDate, filterDrafts]);

  function toggleMetric(metric: AvailableMetric) {
    setMetrics((current) => ({ ...current, [metric]: !current[metric] }));
  }

  function addFilter(category: FilterDraft["category"]) {
    setFilterDrafts((current) => [...current, newFilterDraft(category)]);
  }

  function updateFilter(id: string, updates: Partial<FilterDraft>) {
    setFilterDrafts((current) =>
      current.map((draft) => (draft.id === id ? ({ ...draft, ...updates } as FilterDraft) : draft))
    );
  }

  function removeFilter(id: string) {
    setFilterDrafts((current) => current.filter((draft) => draft.id !== id));
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

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to run analysis");
      }

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
    <main className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${lightMode ? "bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(14,165,233,0.12),transparent_60%),linear-gradient(180deg,#F8FAFC_0%,#EAF1F7_100%)] text-zinc-950" : "bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#050505_0%,#0A0A0A_45%,#121212_100%)] text-white"}`}>
      <section className="mx-auto max-w-[1600px]">
        <ProjectPageHeader
          title="Intelligence"
          accentTitle="Interface"
          subtitle={intelligenceInterfaceSubtitle}
          mobileSubtitle={intelligenceInterfaceMobileSubtitle}
          guideId="intelligence-interface"
          guideMessage="This page will eventually be an interactive analytics workspace and reflects the current stage in its development."
          mobileGuideMessage="Explore BFshop's developing analytics workspace."
          lightMode={lightMode}
          toggleTheme={toggleTheme}
        />
        <WorkspaceReveal>
        <div className="mt-[60px] grid gap-9 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className={`rounded-lg border p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 ${panel}`}>
            <div className="mb-5"><h2 className="font-inter text-2xl font-semibold">Build a request</h2><p className={`mt-2 font-inter text-sm leading-relaxed ${muted}`}>Toggle metrics, a date range, and filters. The request JSON is built for you.</p></div>

            <div className="mb-5">
              <p className={`mb-2 font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>Metrics</p>
              <div className="flex flex-wrap gap-2">
                {allMetrics.map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    onClick={() => toggleMetric(metric)}
                    className={`rounded-full border px-3 py-1.5 font-inter text-sm transition ${metrics[metric] ? "border-sky-400 bg-sky-500/20 text-sky-300" : chip}`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className={`flex cursor-pointer items-center gap-2 font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>
                <input type="checkbox" checked={periodEnabled} onChange={(event) => setPeriodEnabled(event.target.checked)} />
                Date range
              </label>
              {periodEnabled && (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={`rounded-md border p-2 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
                  <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={`rounded-md border p-2 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
                </div>
              )}
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <p className={`font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>Filters</p>
                <div className="flex gap-2">
                  {(["gender", "age", "location"] as const).map((category) => (
                    <button key={category} type="button" onClick={() => addFilter(category)} className={`rounded-md border px-2 py-1 font-inter text-xs ${chip} hover:border-sky-400 hover:text-sky-300`}>
                      + {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {filterDrafts.map((draft) => (
                  <div key={draft.id} className={`flex items-center gap-2 rounded-md border p-2 ${chip}`}>
                    <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-sky-400">{draft.category}</span>

                    {draft.category === "gender" && (
                      <input placeholder="e.g. female" value={draft.value} onChange={(event) => updateFilter(draft.id, { value: event.target.value })} className={`flex-1 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
                    )}

                    {draft.category === "age" && (
                      <>
                        <input type="number" placeholder="min" value={draft.min} onChange={(event) => updateFilter(draft.id, { min: event.target.value })} className={`w-20 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
                        <input type="number" placeholder="max" value={draft.max} onChange={(event) => updateFilter(draft.id, { max: event.target.value })} className={`w-20 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`} />
                      </>
                    )}

                    {draft.category === "location" && (
                      <select
                        value={draft.value}
                        onChange={(event) => updateFilter(draft.id, { value: event.target.value })}
                        className={`flex-1 rounded-md border p-1.5 font-inter text-sm outline-none focus:border-sky-400 ${field}`}
                      >
                        <option value="">Select suburb</option>
                        {syntheticSuburbs.map((suburb) => (
                          <option key={suburb} value={suburb}>
                            {suburb}
                          </option>
                        ))}
                      </select>
                    )}

                    <button type="button" onClick={() => removeFilter(draft.id)} className="font-inter text-xs text-rose-400 hover:text-rose-300">Remove</button>
                  </div>
                ))}
                {filterDrafts.length === 0 && <p className={`font-inter text-sm ${muted}`}>No filters added.</p>}
              </div>
            </div>

            <details className="mb-4">
              <summary className={`cursor-pointer font-inter text-xs font-semibold uppercase tracking-[0.1em] ${muted}`}>Request preview</summary>
              <pre className={`mt-2 max-h-40 overflow-auto rounded-md border p-3 font-mono text-xs leading-relaxed ${field}`}>{JSON.stringify(request, null, 2)}</pre>
            </details>

            <button type="button" onClick={runAnalysis} disabled={isRunning} className="rounded-md bg-sky-500 px-4 py-3 font-inter text-sm font-semibold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-wait disabled:opacity-60">{isRunning ? "Running..." : "Run analysis"}</button>
          </section>
          <section className={`rounded-lg border p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 ${panel}`}>
            <div className="mb-5"><h2 className="font-inter text-2xl font-semibold">Result</h2></div>
            <pre className={`min-h-64 overflow-auto rounded-md border p-4 font-mono text-sm leading-relaxed ${field}`}>{error ? <span className="text-rose-400">{error}</span> : output === null ? <span className={muted}>Run a request to see its output.</span> : JSON.stringify(output, null, 2)}</pre>
          </section>
        </div>
        {output?.revenue?.series && (
          <RevenueCharts lightMode={lightMode} revenue={output.revenue} />
        )}
        </WorkspaceReveal>
      </section>
    </main>
  );
}
