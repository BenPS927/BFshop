"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  AnalysisRequest,
  Breakdown,
  Comparison,
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
  id: number;
  request: AnalysisRequest;
  result: ResultsContract;
};

const metrics = ["revenue", "orders", "itemsSold"] as const satisfies readonly Metric[];
const breakdownCategories = ["gender", "age", "location"] as const satisfies readonly Breakdown["category"][];
const minimumDate = "2026-08-16";
const metricLabels: Record<Metric, string> = {
  revenue: "Revenue",
  orders: "Orders",
  itemsSold: "Items sold",
};
const breakdownLabels: Record<Breakdown["category"], string> = {
  gender: "Gender",
  age: "Age group",
  location: "Neighbourhood",
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

function ResultVisualisation({ result, lightMode }: { result: ResultsContract; lightMode: boolean }) {
  const chartText = lightMode ? "#18181b" : "#f4f4f5";
  const chartGrid = lightMode ? "#d4d4d8" : "rgba(255,255,255,0.14)";
  const chartColours = ["#38bdf8", "#818cf8", "#2dd4bf", "#f59e0b"];
  const longestSeries = result.series.reduce<(typeof result.series)[number] | undefined>(
    (longest, series) => !longest || series.points.length > longest.points.length ? series : longest,
    undefined,
  );
  const points = longestSeries?.points ?? [];
  const xValues = points.map((point) => result.axes.x.unit === "date" ? formatDate(point.x) : String(point.x));
  const formatterForAxis = (axisKey: string) => {
    const axis = result.axes.y.find((candidate) => candidate.key === axisKey) ?? result.axes.y[0];
    return axis?.unit === "currency"
      ? (value: number | null) => currencyFormatter.format(value ?? 0)
      : (value: number | null) => numberFormatter.format(value ?? 0);
  };
  const yAxes = result.axes.y.map((axis, index) => ({
    id: axis.key,
    label: axis.unit === "currency" ? `${axis.label} (AUD)` : axis.label,
    position: index === 0 ? "left" as const : "right" as const,
    valueFormatter: formatterForAxis(axis.key),
    width: 80,
    tickLabelStyle: { fill: chartText },
    labelStyle: { fill: chartText },
  }));
  const xAxisLabel = result.axes.x.unit === "date"
    ? "Date"
    : result.axes.x.unit === "category"
      ? "Category"
      : "Value";
  const chartSx = {
    "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: chartGrid },
    "& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label": { fill: chartText },
    "& .MuiChartsGrid-line": { stroke: chartGrid },
  };

  if (result.chartType === "figure") {
    const value = points[0]?.y;
    const valueFormatter = formatterForAxis(longestSeries?.yAxisKey ?? result.axes.y[0]?.key ?? "");

    return (
      <div className="flex min-h-[400px] items-center justify-center p-6 text-center">
        <p className="font-inter text-5xl font-semibold tracking-tight text-sky-400 md:text-7xl">
          {valueFormatter(value ?? null)}
        </p>
      </div>
    );
  }

  if (result.chartType === "bar") {
    return (
      <BarChart
        height={400}
        xAxis={[{
          data: xValues,
          scaleType: "band",
          label: xAxisLabel,
          tickLabelInterval: "auto",
          tickLabelStyle: { fill: chartText },
          labelStyle: { fill: chartText },
        }]}
        yAxis={yAxes}
        series={result.series.map((series, index) => ({
          id: series.key,
          label: series.label,
          yAxisId: series.yAxisKey,
          data: series.points.map((point) => point.y),
          color: chartColours[index % chartColours.length],
          valueFormatter: formatterForAxis(series.yAxisKey),
        }))}
        grid={{ horizontal: true }}
        hideLegend={result.series.length <= 1}
        margin={{ left: 12, right: 22, top: 28, bottom: 18 }}
        sx={chartSx}
      />
    );
  }

  if (result.chartType === "scatter") {
    return (
      <ScatterChart
        height={400}
        xAxis={[{
          label: xAxisLabel,
          tickLabelStyle: { fill: chartText },
          labelStyle: { fill: chartText },
        }]}
        yAxis={yAxes}
        series={result.series.map((series, seriesIndex) => ({
          id: series.key,
          label: series.label,
          yAxisId: series.yAxisKey,
          data: series.points.flatMap((point, pointIndex) => {
            const x = Number(point.x);
            return Number.isFinite(x)
              ? [{ id: `${series.key}:${pointIndex}`, x, y: point.y }]
              : [];
          }),
          color: chartColours[seriesIndex % chartColours.length],
          valueFormatter: ({ x, y }) => `${numberFormatter.format(x)}, ${formatterForAxis(series.yAxisKey)(y)}`,
        }))}
        grid={{ horizontal: true, vertical: true }}
        hideLegend={result.series.length <= 1}
        margin={{ left: 12, right: 22, top: 28, bottom: 18 }}
        sx={chartSx}
      />
    );
  }

  return (
    <LineChart
      height={400}
      xAxis={[{
        data: xValues,
        scaleType: "band",
        label: xAxisLabel,
        tickLabelInterval: "auto",
        tickLabelStyle: { fill: chartText },
        labelStyle: { fill: chartText },
      }]}
      yAxis={yAxes}
      series={result.series.map((series, index) => ({
        id: series.key,
        label: series.label,
        yAxisId: series.yAxisKey,
        data: series.points.map((point) => point.y),
        color: chartColours[index % chartColours.length],
        valueFormatter: formatterForAxis(series.yAxisKey),
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
      sx={chartSx}
    />
  );
}

export function IntelligenceInterface({ lightMode, workspaceMode = false }: IntelligenceInterfaceProps) {
  const interfaceRef = useRef<HTMLElement>(null);
  const [metric, setMetric] = useState<Metric>("revenue");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [periodEnabled, setPeriodEnabled] = useState(true);
  const [interval, setInterval] = useState<NonNullable<AnalysisRequest["period"]>["interval"] | "">("day");
  const [gender, setGender] = useState("");
  const [minimumAge, setMinimumAge] = useState("");
  const [maximumAge, setMaximumAge] = useState("");
  const [location, setLocation] = useState("");
  const [breakdownCategory, setBreakdownCategory] = useState<Breakdown["category"] | "">("");
  const [comparisonCategory, setComparisonCategory] = useState<Comparison["category"] | "">("");
  const [comparisonMetric, setComparisonMetric] = useState<Metric | "">("");
  const [comparisonStartDate, setComparisonStartDate] = useState(minimumDate);
  const [comparisonEndDate, setComparisonEndDate] = useState(minimumDate);
  const [comparisonFilterCategory, setComparisonFilterCategory] = useState<Filter["category"] | "">("");
  const [comparisonGender, setComparisonGender] = useState("");
  const [comparisonMinimumAge, setComparisonMinimumAge] = useState("");
  const [comparisonMaximumAge, setComparisonMaximumAge] = useState("");
  const [comparisonLocation, setComparisonLocation] = useState("");
  const [result, setResult] = useState<ResultsContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [isLoadingSavedCharts, setIsLoadingSavedCharts] = useState(workspaceMode);
  const [isSavingChart, setIsSavingChart] = useState(false);
  const [deletingSavedChartId, setDeletingSavedChartId] = useState<number | null>(null);
  const [savedChartsError, setSavedChartsError] = useState<string | null>(null);

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

  const activeFilterCategories = filters.map((filter) => filter.category);
  const availableBreakdowns = breakdownCategories.filter((category) => {
    if (activeFilterCategories.includes(category)) return false;
    if (comparisonCategory === "filter" && comparisonFilterCategory === category) return false;
    return true;
  });

  const comparison = useMemo<Comparison | undefined>(() => {
    if (comparisonCategory === "metric" && comparisonMetric && comparisonMetric !== metric) {
      return { category: "metric", metric: comparisonMetric };
    }
    if (
      comparisonCategory === "period" &&
      periodEnabled &&
      comparisonStartDate &&
      comparisonEndDate &&
      comparisonStartDate <= comparisonEndDate &&
      (comparisonStartDate !== startDate || comparisonEndDate !== endDate)
    ) {
      return { category: "period", dateRange: [comparisonStartDate, comparisonEndDate] };
    }
    if (comparisonCategory === "filter" && comparisonFilterCategory === "gender" && comparisonGender && comparisonGender !== gender) {
      return { category: "filter", filter: { category: "gender", parameters: comparisonGender } };
    }
    if (
      comparisonCategory === "filter" &&
      comparisonFilterCategory === "age" &&
      comparisonMinimumAge &&
      comparisonMaximumAge &&
      Number(comparisonMinimumAge) <= Number(comparisonMaximumAge)
    ) {
      return {
        category: "filter",
        filter: { category: "age", parameters: [Number(comparisonMinimumAge), Number(comparisonMaximumAge)] },
      };
    }
    if (comparisonCategory === "filter" && comparisonFilterCategory === "location" && comparisonLocation && comparisonLocation !== location) {
      return { category: "filter", filter: { category: "location", parameters: comparisonLocation } };
    }
    return undefined;
  }, [
    comparisonCategory,
    comparisonEndDate,
    comparisonFilterCategory,
    comparisonGender,
    comparisonLocation,
    comparisonMaximumAge,
    comparisonMetric,
    comparisonMinimumAge,
    comparisonStartDate,
    endDate,
    gender,
    location,
    metric,
    periodEnabled,
    startDate,
  ]);

  const request = useMemo<AnalysisRequest>(() => ({
    metrics: [metric],
    ...(periodEnabled ? {
      period: {
        dateRange: [startDate, endDate],
        ...(interval ? { interval } : {}),
      },
    } : {}),
    ...(filters.length > 0 ? { filters } : {}),
    ...(breakdownCategory ? { breakdown: { category: breakdownCategory } } : {}),
    ...(comparison ? { comparison } : {}),
  }), [breakdownCategory, comparison, endDate, filters, interval, metric, periodEnabled, startDate]);

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
    if (periodEnabled && (!startDate || !endDate || startDate > endDate)) {
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
  }, [endDate, periodEnabled, request, startDate]);

  useEffect(() => {
    if (breakdownCategory && !availableBreakdowns.includes(breakdownCategory)) {
      setBreakdownCategory("");
    }
  }, [availableBreakdowns, breakdownCategory]);

  useEffect(() => {
    if (!workspaceMode) return;

    const controller = new AbortController();

    async function loadSavedCharts() {
      try {
        const response = await fetch("/api/merchant/saved-views", {
          signal: controller.signal,
        });
        const output = await response.json();

        if (!response.ok) {
          throw new Error(output.error ?? "Unable to load saved views");
        }

        setSavedCharts(output);
      } catch (caughtError) {
        if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
        setSavedChartsError(caughtError instanceof Error ? caughtError.message : "Unable to load saved views");
      } finally {
        if (!controller.signal.aborted) setIsLoadingSavedCharts(false);
      }
    }

    void loadSavedCharts();
    return () => controller.abort();
  }, [workspaceMode]);

  const activeFilters = [
    gender ? `Gender: ${gender}` : "",
    minimumAge && maximumAge ? `Age: ${minimumAge}–${maximumAge}` : "",
    location ? `Location: ${location}` : "",
  ].filter(Boolean);

  const periodSummary = periodEnabled
    ? `${formatDate(startDate)}–${formatDate(endDate)} · ${interval || "total"}`
    : "All time";
  const comparisonSummary = comparison?.category === "metric"
    ? `Metric: ${metricLabels[comparison.metric]}`
    : comparison?.category === "period"
      ? `Period: ${formatDate(comparison.dateRange[0])}–${formatDate(comparison.dateRange[1])}`
      : comparison?.category === "filter"
        ? `${breakdownLabels[comparison.filter.category]}: ${comparison.filter.category === "age" ? comparison.filter.parameters.join("–") : comparison.filter.parameters}`
        : "None";

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
    setPeriodEnabled(true);
    setStartDate(defaultStartDate());
    setEndDate(today());
    setInterval("day");
    setGender("");
    setMinimumAge("");
    setMaximumAge("");
    setLocation("");
    setBreakdownCategory("");
    setComparisonCategory("");
    setComparisonMetric("");
    setComparisonStartDate(minimumDate);
    setComparisonEndDate(minimumDate);
    setComparisonFilterCategory("");
    setComparisonGender("");
    setComparisonMinimumAge("");
    setComparisonMaximumAge("");
    setComparisonLocation("");
  }

  async function saveChart() {
    if (!result || isLoading || isSavingChart || savedCharts.length >= 5) return;

    setIsSavingChart(true);
    setSavedChartsError(null);

    try {
      const response = await fetch("/api/merchant/saved-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const output = await response.json();

      if (!response.ok) {
        throw new Error(output.error ?? "Unable to save view");
      }

      setSavedCharts((current) => [
        ...current,
        {
          id: output.id,
          request: structuredClone(request),
          result: structuredClone(result),
        },
      ]);
    } catch (caughtError) {
      setSavedChartsError(caughtError instanceof Error ? caughtError.message : "Unable to save view");
    } finally {
      setIsSavingChart(false);
    }
  }

  async function deleteSavedChart(id: number) {
    setDeletingSavedChartId(id);
    setSavedChartsError(null);

    try {
      const response = await fetch("/api/merchant/saved-views", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const output = await response.json();

      if (!response.ok) {
        throw new Error(output.error ?? "Unable to delete saved view");
      }

      setSavedCharts((current) => current.filter((savedChart) => savedChart.id !== id));
    } catch (caughtError) {
      setSavedChartsError(caughtError instanceof Error ? caughtError.message : "Unable to delete saved view");
    } finally {
      setDeletingSavedChartId(null);
    }
  }

  return (
    <div className={workspaceMode ? "mx-auto max-w-[1400px]" : ""}>
    <article ref={interfaceRef} className={`relative min-h-[560px] rounded-xl border p-4 md:p-6 ${workspaceMode ? "mx-auto max-w-5xl" : ""} ${panel}`}>
      <header className="text-center">
        <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
          {result?.title ?? `${metricLabels[metric]} over time`}
        </h2>
        {workspaceMode && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={resetChart} className={`rounded-full border px-4 py-2 font-inter text-sm font-medium transition hover:border-sky-400 ${capsule}`}>
              Reset to default
            </button>
            <button type="button" onClick={saveChart} disabled={!result || isLoading || isSavingChart || savedCharts.length >= 5} className="rounded-full border border-sky-400/70 bg-sky-500/15 px-4 py-2 font-inter text-sm font-medium text-sky-400 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-40">
              {isSavingChart ? "Saving…" : savedCharts.length >= 5 ? "Saved views full" : "Save chart"}
            </button>
          </div>
        )}
      </header>

      <div className="mt-6 grid grid-cols-6 gap-2 md:grid-cols-5 md:gap-3">
        <details className="group relative col-span-2 md:col-span-1">
          <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-2 rounded-md border px-3 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Metric</span>
              <span className="block truncate font-inter text-xs font-medium md:text-sm">{metricLabels[metric]}</span>
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

        <details className="group relative col-span-2 md:col-span-1">
          <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-2 rounded-md border px-3 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Period</span>
              <span className="block truncate font-inter text-xs font-medium md:text-sm">{periodSummary}</span>
            </span>
            <span aria-hidden="true" className="text-sky-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className={`absolute left-1/2 top-[calc(100%+0.5rem)] z-30 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 space-y-3 rounded-lg border p-4 md:left-0 md:translate-x-0 ${dropdown}`}>
            <label className="flex items-center gap-2 font-inter text-xs font-medium">
              <input type="checkbox" checked={periodEnabled} onChange={(event) => setPeriodEnabled(event.target.checked)} className="size-4 accent-sky-500" />
              Use a date range
            </label>
            {periodEnabled && (
              <>
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
                  <select value={interval} onChange={(event) => setInterval(event.target.value as typeof interval)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                    <option value="">None — total for period</option>
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                  </select>
                </label>
              </>
            )}
          </div>
        </details>

        <details className="group relative col-span-2 md:col-span-1">
          <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-2 rounded-md border px-3 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Filters</span>
              <span className="block truncate font-inter text-xs font-medium md:text-sm">{joinSummary(activeFilters)}</span>
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

        <details className="group relative col-span-3 md:col-span-1">
          <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-2 rounded-md border px-3 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Breakdown</span>
              <span className="block truncate font-inter text-xs font-medium md:text-sm">{breakdownCategory ? breakdownLabels[breakdownCategory] : "None"}</span>
            </span>
            <span aria-hidden="true" className="text-sky-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-44 rounded-lg border p-2 ${dropdown}`}>
            <button type="button" onClick={(event) => { setBreakdownCategory(""); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`block w-full rounded-md px-3 py-2 text-left font-inter text-sm transition hover:bg-sky-500/10 ${!breakdownCategory ? "text-sky-400" : ""}`}>
              None
            </button>
            {breakdownCategories.map((category) => {
              const available = availableBreakdowns.includes(category);
              return (
                <button key={category} type="button" disabled={!available} onClick={(event) => { setBreakdownCategory(category); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={`block w-full rounded-md px-3 py-2 text-left font-inter text-sm transition hover:bg-sky-500/10 disabled:cursor-not-allowed disabled:opacity-35 ${category === breakdownCategory ? "text-sky-400" : ""}`}>
                  {breakdownLabels[category]}
                </button>
              );
            })}
          </div>
        </details>

        <details className="group relative col-span-3 md:col-span-1">
          <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-2 rounded-md border px-3 py-2 transition hover:border-sky-400 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Compare</span>
              <span className="block truncate font-inter text-xs font-medium md:text-sm">{comparisonSummary}</span>
            </span>
            <span aria-hidden="true" className="text-sky-400 transition group-open:rotate-180">⌄</span>
          </summary>
          <div className={`absolute right-0 top-[calc(100%+0.5rem)] z-30 w-[min(19rem,calc(100vw-2rem))] space-y-3 rounded-lg border p-4 ${dropdown}`}>
            <label className="block font-inter text-xs font-medium">
              Compare another
              <select value={comparisonCategory} onChange={(event) => setComparisonCategory(event.target.value as Comparison["category"] | "")} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                <option value="">Nothing</option>
                <option value="metric">Metric</option>
                <option value="period" disabled={!periodEnabled}>Period</option>
                <option value="filter" disabled={activeFilterCategories.length === 0}>Filter</option>
              </select>
            </label>

            {comparisonCategory === "metric" && (
              <label className="block font-inter text-xs font-medium">
                Metric
                <select value={comparisonMetric} onChange={(event) => setComparisonMetric(event.target.value as Metric | "")} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                  <option value="">Choose a metric</option>
                  {metrics.filter((option) => option !== metric).map((option) => <option key={option} value={option}>{metricLabels[option]}</option>)}
                </select>
              </label>
            )}

            {comparisonCategory === "period" && periodEnabled && (
              <>
                <label className="block font-inter text-xs font-medium">
                  Comparison start
                  <input type="date" min={minimumDate} max={comparisonEndDate} value={comparisonStartDate} onChange={(event) => setComparisonStartDate(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} />
                </label>
                <label className="block font-inter text-xs font-medium">
                  Comparison end
                  <input type="date" min={comparisonStartDate || minimumDate} max={today()} value={comparisonEndDate} onChange={(event) => setComparisonEndDate(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} />
                </label>
              </>
            )}

            {comparisonCategory === "filter" && (
              <>
                <label className="block font-inter text-xs font-medium">
                  Filter
                  <select value={comparisonFilterCategory} onChange={(event) => setComparisonFilterCategory(event.target.value as Filter["category"] | "")} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                    <option value="">Choose an active filter</option>
                    {activeFilterCategories.map((category) => <option key={category} value={category}>{breakdownLabels[category]}</option>)}
                  </select>
                </label>
                {comparisonFilterCategory === "gender" && (
                  <label className="block font-inter text-xs font-medium">
                    Compare with
                    <select value={comparisonGender} onChange={(event) => setComparisonGender(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                      <option value="">Choose a gender</option>
                      {gender !== "female" && <option value="female">Female</option>}
                      {gender !== "male" && <option value="male">Male</option>}
                    </select>
                  </label>
                )}
                {comparisonFilterCategory === "age" && (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="font-inter text-xs font-medium">Minimum age<input type="number" min="18" max="75" value={comparisonMinimumAge} onChange={(event) => setComparisonMinimumAge(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} /></label>
                    <label className="font-inter text-xs font-medium">Maximum age<input type="number" min="18" max="75" value={comparisonMaximumAge} onChange={(event) => setComparisonMaximumAge(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`} /></label>
                  </div>
                )}
                {comparisonFilterCategory === "location" && (
                  <label className="block font-inter text-xs font-medium">
                    Compare with
                    <select value={comparisonLocation} onChange={(event) => setComparisonLocation(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                      <option value="">Choose a neighbourhood</option>
                      {syntheticSuburbs.filter((suburb) => suburb !== location).map((suburb) => <option key={suburb} value={suburb}>{suburb}</option>)}
                    </select>
                  </label>
                )}
              </>
            )}

            {comparisonCategory && !comparison && (
              <p className={`font-inter text-[11px] leading-relaxed ${muted}`}>Choose the alternative you want to add to the current result.</p>
            )}
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
            {result && <ResultVisualisation result={result} lightMode={lightMode} />}
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
    {workspaceMode && (
      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <p className={`font-inter text-xs font-semibold uppercase tracking-[0.14em] ${muted}`}>
            Saved views
          </p>
          <p className={`font-inter text-xs ${muted}`}>{savedCharts.length}/5</p>
        </div>

        {savedChartsError && (
          <p className="mt-3 font-inter text-sm text-rose-400">{savedChartsError}</p>
        )}

        {isLoadingSavedCharts ? (
          <p className={`mt-6 font-inter text-sm ${muted}`}>Loading saved views…</p>
        ) : savedCharts.length === 0 ? (
          <p className={`mt-6 font-inter text-sm ${muted}`}>No views have been saved yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:gap-6 xl:grid-cols-2">
            {savedCharts.map((savedChart) => (
              <article key={savedChart.id} className={`min-h-[520px] rounded-xl border p-4 md:p-6 ${panel}`}>
                <header className="flex items-start justify-between gap-4">
                  <h2 className="font-inter text-xl font-semibold leading-snug md:text-2xl">
                    {savedChart.result.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => deleteSavedChart(savedChart.id)}
                    disabled={deletingSavedChartId === savedChart.id}
                    className={`shrink-0 rounded-full border px-3 py-2 font-inter text-xs font-medium transition hover:border-rose-400 hover:text-rose-400 disabled:cursor-wait disabled:opacity-50 ${capsule}`}
                  >
                    {deletingSavedChartId === savedChart.id ? "Deleting…" : "Delete"}
                  </button>
                </header>
                <div className="mt-6 min-h-[400px] overflow-hidden rounded-lg border border-current/10">
                  <ResultVisualisation result={savedChart.result} lightMode={lightMode} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    )}
    </div>
  );
}
