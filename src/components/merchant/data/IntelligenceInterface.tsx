"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AnalysisRequest,
  Filter,
  Metric,
} from "@/app/types/slice3MetricsAndHistory/analysisRequest";
import type { ResultsContract } from "@/app/types/slice3MetricsAndHistory/resultsContract";
import { syntheticSuburbs } from "@/data/syntheticEconomy/locations";

type IntelligenceInterfaceProps = {
  lightMode: boolean;
  workspaceMode?: boolean;
};

type SavedChart = {
  id: string;
  result: ResultsContract;
};

const metrics = ["revenue", "orders", "itemsSold"] as const satisfies readonly Metric[];
const minimumDate = "2026-08-16";
const metricLabels: Record<Metric, string> = {
  revenue: "Revenue",
  orders: "Orders",
  itemsSold: "Items sold",
};

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function formatInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function today(): string {
  return formatInputDate(new Date());
}

function defaultStartDate(): string {
  const start = new Date();
  start.setDate(start.getDate() - 29);
  const thirtyDayStart = formatInputDate(start);
  return thirtyDayStart < minimumDate ? minimumDate : thirtyDayStart;
}

function formatDate(date: string | number): string {
  if (typeof date === "number") return String(date);
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

function joinSummary(parts: string[]): string {
  return parts.length > 0 ? parts.join(", ") : "None";
}

function ResultChart({ result, lightMode }: { result: ResultsContract; lightMode: boolean }) {
  const chartText = lightMode ? "#18181b" : "#f4f4f5";
  const chartGrid = lightMode ? "#d4d4d8" : "rgba(255,255,255,0.14)";
  const chartColours = ["#38bdf8", "#818cf8", "#2dd4bf", "#f59e0b"];
  const points = result.series[0]?.points ?? [];
  const xValues = points.map((point) => formatDate(point.x));
  const valueFormatter = result.axes.y.unit === "currency"
    ? (value: number | null) => currencyFormatter.format(value ?? 0)
    : (value: number | null) => numberFormatter.format(value ?? 0);
  const yAxisLabel = result.axes.y.unit === "currency"
    ? `${metricLabels[result.metric]} (AUD)`
    : metricLabels[result.metric];

  return (
    <LineChart
      height={400}
      xAxis={[{
        data: xValues,
        scaleType: "band",
        label: result.axes.x.unit === "date" ? "Date" : result.axes.x.unit,
        tickLabelInterval: "auto",
        tickLabelStyle: { fill: chartText },
        labelStyle: { fill: chartText },
      }]}
      yAxis={[{
        label: yAxisLabel,
        valueFormatter,
        width: 80,
        tickLabelStyle: { fill: chartText },
        labelStyle: { fill: chartText },
      }]}
      series={result.series.map((series, index) => ({
        id: series.key,
        label: series.label,
        data: series.points.map((point) => point.y),
        color: chartColours[index % chartColours.length],
        valueFormatter,
        showMark: series.points.length <= 45,
      }))}
      grid={{ horizontal: true }}
      hideLegend={result.series.length <= 1}
      slotProps={{
        tooltip: {
          trigger: "axis",
          anchor: "pointer",
          position: "bottom",
          disablePortal: true,
        },
      }}
      margin={{ left: 12, right: 22, top: 28, bottom: 18 }}
      sx={{
        "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: chartGrid },
        "& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label": { fill: chartText },
        "& .MuiChartsGrid-line": { stroke: chartGrid },
      }}
    />
  );
}

export function IntelligenceInterface({ lightMode, workspaceMode = false }: IntelligenceInterfaceProps) {
  const interfaceRef = useRef<HTMLElement>(null);
  const [metric, setMetric] = useState<Metric>("revenue");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [interval, setInterval] = useState<AnalysisRequest["period"]["interval"]>("day");
  const [gender, setGender] = useState("");
  const [minimumAge, setMinimumAge] = useState("");
  const [maximumAge, setMaximumAge] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<ResultsContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);

  const filters = useMemo<Filter[]>(() => {
    const selected: Filter[] = [];

    if (gender) selected.push({ category: "gender", parameters: gender });
    if (minimumAge && maximumAge) {
      selected.push({
        category: "age",
        parameters: [Number(minimumAge), Number(maximumAge)],
      });
    }
    if (location) selected.push({ category: "location", parameters: location });

    return selected;
  }, [gender, location, maximumAge, minimumAge]);

  const request = useMemo<AnalysisRequest>(() => ({
    metrics: [metric],
    period: {
      dateRange: [startDate, endDate],
      interval,
    },
    ...(filters.length > 0 ? { filters } : {}),
  }), [endDate, filters, interval, metric, startDate]);

  useEffect(() => {
    function closeOpenMenu(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      interfaceRef.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((menu) => {
        if (!menu.contains(target)) menu.removeAttribute("open");
      });
    }

    document.addEventListener("pointerdown", closeOpenMenu);
    return () => document.removeEventListener("pointerdown", closeOpenMenu);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) {
      setError("Choose a valid date range.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadingFrame = window.requestAnimationFrame(() => {
      setIsLoading(true);
      setError(null);
    });
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/merchant/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: controller.signal,
        });
        const output = await response.json();

        if (!response.ok) {
          throw new Error(output.error ?? "Unable to load chart data");
        }

        setResult(output);
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
        setError(caughtError instanceof Error ? caughtError.message : "Unable to load chart data");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 350);

    return () => {
      window.cancelAnimationFrame(loadingFrame);
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [endDate, request, startDate]);

  const activeFilters = [
    gender ? `Gender: ${gender}` : "",
    minimumAge && maximumAge ? `Age: ${minimumAge}–${maximumAge}` : "",
    location ? `Location: ${location}` : "",
  ].filter(Boolean);

  const panel = lightMode
    ? "border-zinc-300 bg-white/90 text-zinc-950 shadow-[0_20px_48px_rgba(15,23,42,0.12)]"
    : "border-white/15 bg-white/[0.07] text-white shadow-[0_20px_52px_rgba(0,0,0,0.34)]";
  const capsule = lightMode
    ? "border-zinc-300 bg-zinc-50 text-zinc-950"
    : "border-white/15 bg-black/25 text-white";
  const dropdown = lightMode
    ? "border-zinc-300 bg-white text-zinc-950 shadow-[0_18px_42px_rgba(15,23,42,0.16)]"
    : "border-white/15 bg-zinc-900 text-white shadow-[0_20px_46px_rgba(0,0,0,0.45)]";
  const field = lightMode
    ? "border-zinc-300 bg-zinc-50 text-zinc-950"
    : "border-white/15 bg-black/25 text-white";
  const muted = lightMode ? "text-zinc-600" : "text-zinc-400";
  const points = result?.series[0]?.points ?? [];

  function resetChart() {
    setMetric("revenue");
    setStartDate(defaultStartDate());
    setEndDate(today());
    setInterval("day");
    setGender("");
    setMinimumAge("");
    setMaximumAge("");
    setLocation("");
  }

  function saveChart() {
    if (!result || isLoading) return;

    setSavedCharts((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        result: structuredClone(result),
      },
    ]);
  }

  return (
    <div className={workspaceMode ? `mx-auto grid gap-6 ${savedCharts.length > 0 ? "max-w-[1400px] xl:grid-cols-2" : "max-w-5xl"}` : ""}>
    <article ref={interfaceRef} className={`relative min-h-[560px] rounded-xl border p-4 md:p-6 ${panel}`}>
      <header className="text-center">
        <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
          {result?.title ?? `${metricLabels[metric]} over time`}
        </h2>
        {workspaceMode && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={resetChart} className={`rounded-full border px-4 py-2 font-inter text-sm font-medium transition hover:border-sky-400 ${capsule}`}>
              Reset to default
            </button>
            <button type="button" onClick={saveChart} disabled={!result || isLoading} className="rounded-full border border-sky-400/70 bg-sky-500/15 px-4 py-2 font-inter text-sm font-medium text-sky-400 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-40">
              Save chart
            </button>
          </div>
        )}
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 md:gap-4">
        <details className="group relative">
          <summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-full border px-4 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[11px] font-semibold uppercase tracking-[0.12em] ${muted}`}>Select metric</span>
              <span className="block truncate font-inter text-sm font-medium">{metricLabels[metric]}</span>
            </span>
            <span aria-hidden="true" className="text-sky-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-52 rounded-lg border p-2 ${dropdown}`}>
            {metrics.map((option) => (
              <button key={option} type="button" onClick={(event) => { setMetric(option); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`block w-full rounded-md px-3 py-2 text-left font-inter text-sm transition hover:bg-sky-500/10 ${option === metric ? "text-sky-400" : ""}`}>
                {metricLabels[option]}
              </button>
            ))}
          </div>
        </details>

        <details className="group relative">
          <summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-full border px-4 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[11px] font-semibold uppercase tracking-[0.12em] ${muted}`}>Select period</span>
              <span className="block truncate font-inter text-sm font-medium">{formatDate(startDate)}–{formatDate(endDate)} · {interval}</span>
            </span>
            <span aria-hidden="true" className="text-sky-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-72 space-y-3 rounded-lg border p-4 ${dropdown}`}>
            <label className="block font-inter text-xs font-medium">
              Start date
              <input type="date" min={minimumDate} max={endDate} value={startDate} onChange={(event) => setStartDate(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} />
            </label>
            <label className="block font-inter text-xs font-medium">
              End date
              <input type="date" min={startDate || minimumDate} max={today()} value={endDate} onChange={(event) => setEndDate(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} />
            </label>
            <label className="block font-inter text-xs font-medium">
              Interval
              <select value={interval} onChange={(event) => setInterval(event.target.value as AnalysisRequest["period"]["interval"])} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </label>
          </div>
        </details>

        <details className="group relative">
          <summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-full border px-4 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[11px] font-semibold uppercase tracking-[0.12em] ${muted}`}>Edit filters</span>
              <span className="block truncate font-inter text-sm font-medium">{joinSummary(activeFilters)}</span>
            </span>
            <span aria-hidden="true" className="text-sky-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className={`absolute right-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-72 space-y-3 rounded-lg border p-4 ${dropdown}`}>
            <label className="block font-inter text-xs font-medium">
              Gender
              <select value={gender} onChange={(event) => setGender(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                <option value="">Any</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="font-inter text-xs font-medium">
                Minimum age
                <input type="number" min="18" max="75" value={minimumAge} onChange={(event) => setMinimumAge(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} />
              </label>
              <label className="font-inter text-xs font-medium">
                Maximum age
                <input type="number" min="18" max="75" value={maximumAge} onChange={(event) => setMaximumAge(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} />
              </label>
            </div>
            <label className="block font-inter text-xs font-medium">
              Location
              <select value={location} onChange={(event) => setLocation(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                <option value="">Any</option>
                {syntheticSuburbs.map((suburb) => <option key={suburb} value={suburb}>{suburb}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => { setGender(""); setMinimumAge(""); setMaximumAge(""); setLocation(""); }} className="font-inter text-xs font-medium text-sky-400 hover:text-sky-300">
              Clear filters
            </button>
          </div>
        </details>
      </div>

      <div className="relative mt-6 min-h-[400px] overflow-hidden rounded-lg border border-current/10 md:mt-8">
        {error ? (
          <div className="flex min-h-[400px] items-center justify-center p-6 text-center font-inter text-sm text-rose-400">{error}</div>
        ) : isLoading && result === null ? (
          <div className={`flex min-h-[400px] items-center justify-center font-inter text-sm ${muted}`}>Loading chart…</div>
        ) : points.length === 0 ? (
          <div className={`flex min-h-[400px] items-center justify-center p-6 text-center font-inter text-sm ${muted}`}>No data was found for this configuration.</div>
        ) : (
          <>
            {result && <ResultChart result={result} lightMode={lightMode} />}
            {isLoading && (
              <div className={`absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[1px] ${lightMode ? "bg-white/60" : "bg-zinc-950/55"}`}>
                <div className={`flex items-center gap-3 rounded-full border px-4 py-2 font-inter text-sm shadow-lg ${capsule}`}>
                  <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-sky-400 motion-reduce:animate-none" />
                  Updating chart…
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </article>
    {workspaceMode && savedCharts.map((savedChart) => (
      <article key={savedChart.id} className={`min-h-[560px] rounded-xl border p-4 md:p-6 ${panel}`}>
        <header className="text-center">
          <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
            {savedChart.result.title}
          </h2>
          <p className={`mt-2 font-inter text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>Saved chart</p>
        </header>
        <div className="mt-6 min-h-[400px] overflow-hidden rounded-lg border border-current/10 md:mt-8">
          <ResultChart result={savedChart.result} lightMode={lightMode} />
        </div>
      </article>
    ))}
    </div>
  );
}
