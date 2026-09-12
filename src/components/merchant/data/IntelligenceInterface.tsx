"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import Slider from "@mui/material/Slider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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

type ProductOption = {
  id: number;
  title: string;
  category: string;
};

type LineVisibilityState = {
  resultKey: string;
  visibleSeriesKeys: string[];
};

type ChartZoomState = {
  resultKey: string;
  range: [number, number];
};

const metrics = [
  "revenue",
  "orders",
  "itemsSold",
  "averageOrderValue",
  "averageItemsPerOrder",
  "averageItemValue",
] as const satisfies readonly Metric[];
const breakdownCategories = ["gender", "age", "location", "productId", "productCategory"] as const satisfies readonly Breakdown["category"][];
const minimumDate = "2026-08-16";
const metricLabels: Record<Metric, string> = {
  revenue: "Revenue",
  orders: "Orders",
  itemsSold: "Items sold",
  averageOrderValue: "Average order value",
  averageItemsPerOrder: "Average items per order",
  averageItemValue: "Average item value",
};
const breakdownLabels: Record<Breakdown["category"], string> = {
  gender: "Gender",
  age: "Age group",
  location: "Neighbourhood",
  productId: "Product",
  productCategory: "Product category",
};

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 0,
});

const decimalNumberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 2,
});

const compactNumberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 1,
});

const mobileNeighbourhoodLabels: Record<string, string> = {
  Chermside: "Cherm.",
  Carindale: "Carin.",
  Toowong: "Toow.",
  Paddington: "Padd.",
  "New Farm": "N. Farm",
  Wynnum: "Wyn.",
  Indooroopilly: "Indoor.",
  Coorparoo: "Coorp.",
  Nundah: "Nun.",
  "Mount Gravatt": "Mt Grav.",
};

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

function formatCompactCurrency(value: number): string {
  if (Math.abs(value) < 1000) return currencyFormatter.format(value);
  return `$${compactNumberFormatter.format(value / 1000)}k`;
}

function formatMobileSeriesLabel(label: string): string {
  const dateRange = label.match(/^(\d{1,2}) ([A-Za-z]{3}) \d{4}[–-](\d{1,2}) ([A-Za-z]{3}) \d{4}$/);
  if (!dateRange) return label;

  const [, startDay, startMonth, endDay, endMonth] = dateRange;
  return startMonth === endMonth
    ? `${startDay}–${endDay} ${endMonth}`
    : `${startDay} ${startMonth}–${endDay} ${endMonth}`;
}

function ResultVisualisation({
  result,
  lightMode,
  compact = false,
}: {
  result: ResultsContract;
  lightMode: boolean;
  compact?: boolean;
}) {
  const isMobile = useMediaQuery("(max-width:639px)", { noSsr: true });
  const chartText = lightMode ? "#18181b" : "#f4f4f5";
  const chartGrid = lightMode ? "rgba(24,24,27,0.10)" : "rgba(255,255,255,0.08)";
  const chartFont = "var(--font-inter-ui), Inter, sans-serif";
  const chartColours = [
    "#38bdf8", "#818cf8", "#2dd4bf", "#f59e0b", "#f472b6",
    "#a78bfa", "#fb7185", "#34d399", "#facc15", "#60a5fa",
    "#c084fc", "#22d3ee", "#4ade80", "#fb923c", "#e879f9",
    "#94a3b8", "#bef264", "#f87171", "#67e8f9", "#a3e635",
  ];
  const gradientPrefix = useId().replace(/:/g, "");
  const barGradientIds = chartColours.map((_, index) => `${gradientPrefix}-bar-${index}`);
  const longestSeries = result.series.reduce<(typeof result.series)[number] | undefined>(
    (longest, series) => !longest || series.points.length > longest.points.length ? series : longest,
    undefined,
  );
  const points = longestSeries?.points ?? [];
  const xValues = points.map((point) => result.axes.x.unit === "date" ? formatDate(point.x) : String(point.x));
  const zoomResultKey = `${result.chartType}:${result.metric}:${result.interval ?? "total"}:${result.series.map((series) => `${series.key}:${series.points.length}`).join("|")}`;
  const [chartZoom, setChartZoom] = useState<ChartZoomState>({
    resultKey: zoomResultKey,
    range: [0, 100],
  });
  const zoomRange = chartZoom.resultKey === zoomResultKey ? chartZoom.range : [0, 100] as [number, number];
  const zoomStartIndex = points.length > 1
    ? Math.floor((zoomRange[0] / 100) * (points.length - 1))
    : 0;
  const zoomEndIndex = points.length > 1
    ? Math.ceil((zoomRange[1] / 100) * (points.length - 1)) + 1
    : points.length;
  const displayedXValues = xValues.slice(zoomStartIndex, zoomEndIndex);
  const isZoomed = zoomRange[0] > 0 || zoomRange[1] < 100;
  const canZoom = result.chartType !== "figure" && points.length > 2;
  const displayedPoints = (series: (typeof result.series)[number]) =>
    series.points.slice(zoomStartIndex, zoomEndIndex);
  const formatterForAxis = (axisKey: string, compactCurrency = false) => {
    const axis = result.axes.y.find((candidate) => candidate.key === axisKey) ?? result.axes.y[0];
    return axis?.unit === "currency"
      ? (value: number | null) => compactCurrency
        ? formatCompactCurrency(value ?? 0)
        : currencyFormatter.format(value ?? 0)
      : axis?.unit === "number"
        ? (value: number | null) => decimalNumberFormatter.format(value ?? 0)
        : (value: number | null) => numberFormatter.format(value ?? 0);
  };
  const yAxes = result.axes.y.map((axis, index) => ({
    id: axis.key,
    label: axis.unit === "currency" && !isMobile ? `${axis.label} (AUD)` : axis.label,
    position: index === 0 ? "left" as const : "right" as const,
    valueFormatter: formatterForAxis(axis.key, isMobile),
    width: isMobile ? 58 : 80,
    tickNumber: isMobile ? 4 : undefined,
    tickLabelStyle: { fill: chartText, fontFamily: chartFont, fontSize: isMobile ? 10 : undefined },
    labelStyle: { fill: chartText, fontFamily: chartFont },
  }));
  const xAxisLabel = result.axes.x.unit === "date"
    ? "Date"
    : result.axes.x.unit === "category"
      ? "Category"
      : "Value";
  const useCompactCategoryLabels = (compact || isMobile) && result.axes.x.unit === "category";
  const lineResultKey = `${result.metric}:${result.interval ?? "total"}:${result.series.map((series) => series.key).join("|")}`;
  const rankedLineSeries = [...result.series].sort((first, second) => {
    const firstTotal = first.points.reduce((total, point) => total + point.y, 0);
    const secondTotal = second.points.reduce((total, point) => total + point.y, 0);
    return secondTotal - firstTotal;
  });
  const defaultVisibleSeriesKeys = (result.series.length > 5 ? rankedLineSeries.slice(0, 5) : result.series)
    .map((series) => series.key);
  const [lineVisibility, setLineVisibility] = useState<LineVisibilityState>({
    resultKey: lineResultKey,
    visibleSeriesKeys: defaultVisibleSeriesKeys,
  });
  const visibleSeriesKeys = lineVisibility.resultKey === lineResultKey
    ? lineVisibility.visibleSeriesKeys
    : defaultVisibleSeriesKeys;
  const visibleSeriesKeySet = new Set(visibleSeriesKeys);
  const visibleLineSeries = result.series
    .map((series, index) => ({ series, index }))
    .filter(({ series }) => visibleSeriesKeySet.has(series.key));

  function showRankedSeries(count: number, fromBottom = false) {
    const selected = fromBottom
      ? rankedLineSeries.slice(-count)
      : rankedLineSeries.slice(0, count);
    setLineVisibility({
      resultKey: lineResultKey,
      visibleSeriesKeys: selected.map((series) => series.key),
    });
  }

  function toggleLineSeries(seriesKey: string) {
    setLineVisibility((current) => {
      const currentKeys = current.resultKey === lineResultKey
        ? current.visibleSeriesKeys
        : defaultVisibleSeriesKeys;
      const isVisible = currentKeys.includes(seriesKey);
      if (isVisible && currentKeys.length === 1) return current;

      return {
        resultKey: lineResultKey,
        visibleSeriesKeys: isVisible
          ? currentKeys.filter((key) => key !== seriesKey)
          : [...currentKeys, seriesKey],
      };
    });
  }
  const chartSx = {
    fontFamily: chartFont,
    "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: "transparent" },
    "& text, & .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label, & .MuiChartsLegend-label": {
      fill: chartText,
      fontFamily: chartFont,
    },
    "& .MuiChartsGrid-line": { stroke: chartGrid },
    "& .MuiBarChart-series path, & .MuiBarElement-root": {
      filter: lightMode
        ? "drop-shadow(0 2px 2px rgba(15,23,42,0.10))"
        : "drop-shadow(0 2px 3px rgba(0,0,0,0.24))",
    },
    "& .MuiLineElement-root": {
      strokeWidth: 3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "& .MuiMarkElement-root": {
      transition: "opacity 160ms ease, filter 160ms ease",
    },
    "& .MuiLineChart-highlight": {
      r: 6,
      stroke: lightMode ? "rgba(255,255,255,0.96)" : "rgba(9,9,11,0.92)",
      strokeWidth: 2,
      filter: lightMode
        ? "drop-shadow(0 0 4px rgba(14,165,233,0.55))"
        : "drop-shadow(0 0 5px rgba(125,211,252,0.72))",
      transition: "filter 160ms ease",
    },
  };
  const zoomControl = canZoom ? (
    <div className="mb-2 flex items-center gap-3 px-2 sm:mb-3 sm:px-3">
      <span className={`shrink-0 font-inter text-xs font-medium ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
        Zoom
      </span>
      <Slider
        value={zoomRange}
        onChange={(_, value: number | number[]) => {
          if (!Array.isArray(value)) return;
          setChartZoom({ resultKey: zoomResultKey, range: [value[0], value[1]] });
        }}
        min={0}
        max={100}
        step={1}
        disableSwap
        aria-label="Visible chart range"
        sx={{
          color: lightMode ? "#0284c7" : "#38bdf8",
          height: 3,
          "& .MuiSlider-thumb": { width: 13, height: 13 },
          "& .MuiSlider-rail": { opacity: lightMode ? 0.18 : 0.24 },
        }}
      />
      {isZoomed && (
        <button
          type="button"
          onClick={() => setChartZoom({ resultKey: zoomResultKey, range: [0, 100] })}
          className={`shrink-0 rounded-md border px-2 py-1 font-inter text-xs font-medium transition duration-150 motion-reduce:transition-none ${
            lightMode
              ? "border-zinc-300 text-zinc-600 hover:border-sky-500 hover:text-sky-700"
              : "border-white/15 text-zinc-400 hover:border-sky-400 hover:text-sky-300"
          }`}
        >
          Reset
        </button>
      )}
    </div>
  ) : null;

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
      <div>
        {zoomControl}
        <BarChart
        height={isMobile ? 350 : 400}
        borderRadius={6}
        xAxis={[{
          data: displayedXValues,
          scaleType: "band",
          label: isMobile && result.axes.x.unit === "category" ? undefined : xAxisLabel,
          valueFormatter: isMobile && result.axes.x.unit === "category"
            ? (value, context) => context.location === "tick"
              ? mobileNeighbourhoodLabels[String(value)] ?? String(value)
              : String(value)
            : undefined,
          tickLabelInterval: useCompactCategoryLabels ? () => true : "auto",
          tickLabelStyle: {
            fill: chartText,
            fontFamily: chartFont,
            fontSize: useCompactCategoryLabels ? (isMobile ? 9 : 10) : undefined,
            angle: useCompactCategoryLabels ? 40 : 0,
            textAnchor: useCompactCategoryLabels ? "start" : "middle",
          },
          labelStyle: { fill: chartText, fontFamily: chartFont },
          height: useCompactCategoryLabels ? 92 : undefined,
        }]}
        yAxis={yAxes}
        series={result.series.map((series, index) => ({
          id: series.key,
          label: isMobile ? formatMobileSeriesLabel(series.label) : series.label,
          yAxisId: series.yAxisKey,
          data: displayedPoints(series).map((point) => point.y),
          color: `url(#${barGradientIds[index % barGradientIds.length]})`,
          valueFormatter: formatterForAxis(series.yAxisKey),
        }))}
        grid={{ horizontal: true }}
        hideLegend={result.series.length <= 1}
        margin={{ left: isMobile ? 4 : 12, right: useCompactCategoryLabels ? (isMobile ? 28 : 42) : 22, top: isMobile ? 18 : 28, bottom: useCompactCategoryLabels ? (isMobile ? 62 : 74) : 18 }}
        sx={chartSx}
      >
        <defs>
          {chartColours.map((colour, index) => (
            <linearGradient
              key={colour}
              id={barGradientIds[index]}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop offset="0%" stopColor={colour} stopOpacity="0.76" />
              <stop offset="100%" stopColor={colour} stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>
        </BarChart>
      </div>
    );
  }

  if (result.chartType === "scatter") {
    return (
      <div>
        {zoomControl}
        <ScatterChart
        height={isMobile ? 350 : 400}
        xAxis={[{
          label: xAxisLabel,
          tickLabelStyle: { fill: chartText, fontFamily: chartFont },
          labelStyle: { fill: chartText, fontFamily: chartFont },
        }]}
        yAxis={yAxes}
        series={result.series.map((series, seriesIndex) => ({
          id: series.key,
          label: isMobile ? formatMobileSeriesLabel(series.label) : series.label,
          yAxisId: series.yAxisKey,
          data: displayedPoints(series).flatMap((point, pointIndex) => {
            const x = Number(point.x);
            return Number.isFinite(x)
              ? [{ id: `${series.key}:${pointIndex}`, x, y: point.y }]
              : [];
          }),
          color: chartColours[seriesIndex % chartColours.length],
          valueFormatter: ({ x, y }) => `${numberFormatter.format(x)}, ${formatterForAxis(series.yAxisKey)(y)}`,
        }))}
        grid={{ horizontal: true, vertical: false }}
        hideLegend={result.series.length <= 1}
        margin={{ left: isMobile ? 4 : 12, right: isMobile ? 12 : 22, top: isMobile ? 18 : 28, bottom: 18 }}
        sx={chartSx}
        />
      </div>
    );
  }

  return (
    <div>
      {result.series.length > 1 && (
        <div className="mb-3 space-y-2 px-1 sm:mb-4 sm:px-2">
          {result.series.length > 5 && <div className="flex flex-wrap gap-2">
            {[
              { label: "Top 5", action: () => showRankedSeries(5) },
              { label: "Top 10", action: () => showRankedSeries(10) },
              { label: "Bottom 10", action: () => showRankedSeries(10, true) },
              { label: "Bottom 5", action: () => showRankedSeries(5, true) },
              {
                label: "Show all",
                action: () => setLineVisibility({
                  resultKey: lineResultKey,
                  visibleSeriesKeys: result.series.map((series) => series.key),
                }),
              },
            ].map((control) => (
              <button
                key={control.label}
                type="button"
                onClick={control.action}
                className={`rounded-md border px-2.5 py-1.5 font-inter text-xs font-medium transition duration-150 motion-reduce:transition-none ${
                  lightMode
                    ? "border-zinc-300 bg-white text-zinc-700 hover:border-sky-400 hover:text-sky-600"
                    : "border-white/15 bg-white/[0.04] text-zinc-300 hover:border-sky-400 hover:text-sky-300"
                }`}
              >
                {control.label}
              </button>
            ))}
          </div>}

          <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1" role="group" aria-label="Chart series">
            {result.series.map((series, index) => {
              const isVisible = visibleSeriesKeySet.has(series.key);
              const isOnlyVisibleSeries = isVisible && visibleSeriesKeys.length === 1;
              return (
                <button
                  key={series.key}
                  type="button"
                  aria-pressed={isVisible}
                  aria-disabled={isOnlyVisibleSeries}
                  onClick={() => toggleLineSeries(series.key)}
                  className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-inter text-[11px] font-medium transition duration-150 motion-reduce:transition-none ${
                    isVisible
                      ? lightMode
                        ? "border-zinc-300 bg-zinc-50 text-zinc-800"
                        : "border-white/15 bg-white/[0.06] text-zinc-100"
                      : lightMode
                        ? "border-zinc-200 bg-transparent text-zinc-400 opacity-65"
                        : "border-white/10 bg-transparent text-zinc-500 opacity-65"
                  } ${isOnlyVisibleSeries ? "cursor-not-allowed" : "hover:border-sky-400"}`}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ backgroundColor: chartColours[index % chartColours.length] }}
                  />
                  {isMobile ? formatMobileSeriesLabel(series.label) : series.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {zoomControl}
      <LineChart
      height={isMobile ? 350 : 400}
      xAxis={[{
        data: displayedXValues,
        scaleType: "point",
        label: xAxisLabel,
        tickLabelInterval: "auto",
        tickLabelStyle: { fill: chartText, fontFamily: chartFont },
        labelStyle: { fill: chartText, fontFamily: chartFont },
      }]}
      yAxis={yAxes}
      series={visibleLineSeries.map(({ series, index }) => ({
        id: series.key,
        label: isMobile ? formatMobileSeriesLabel(series.label) : series.label,
        yAxisId: series.yAxisKey,
        data: displayedPoints(series).map((point) => point.y),
        color: chartColours[index % chartColours.length],
        valueFormatter: formatterForAxis(series.yAxisKey),
        showMark: series.points.length <= 24,
      }))}
      grid={{ horizontal: true }}
      hideLegend
      slotProps={{
        tooltip: {
          trigger: "axis",
          anchor: "pointer",
          position: "bottom",
          disablePortal: true,
        },
      }}
      margin={{ left: isMobile ? 4 : 12, right: isMobile ? 12 : 22, top: isMobile ? 18 : 28, bottom: 18 }}
      sx={chartSx}
      />
    </div>
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
  const [productId, setProductId] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [products, setProducts] = useState<ProductOption[]>([]);
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
  const [comparisonProductId, setComparisonProductId] = useState("");
  const [comparisonProductCategory, setComparisonProductCategory] = useState("");
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
    if (productId) selected.push({ category: "productId", parameters: Number(productId) });
    if (productCategory) selected.push({ category: "productCategory", parameters: productCategory });

    return selected;
  }, [gender, location, maximumAge, minimumAge, productCategory, productId]);

  const productCategories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort((first, second) => first.localeCompare(second)),
    [products],
  );

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
    if (comparisonCategory === "filter" && comparisonFilterCategory === "productId" && comparisonProductId && comparisonProductId !== productId) {
      return { category: "filter", filter: { category: "productId", parameters: Number(comparisonProductId) } };
    }
    if (comparisonCategory === "filter" && comparisonFilterCategory === "productCategory" && comparisonProductCategory && comparisonProductCategory !== productCategory) {
      return { category: "filter", filter: { category: "productCategory", parameters: comparisonProductCategory } };
    }
    return undefined;
  }, [
    comparisonCategory,
    comparisonEndDate,
    comparisonFilterCategory,
    comparisonGender,
    comparisonLocation,
    comparisonProductCategory,
    comparisonProductId,
    comparisonMaximumAge,
    comparisonMetric,
    comparisonMinimumAge,
    comparisonStartDate,
    endDate,
    gender,
    location,
    metric,
    periodEnabled,
    productCategory,
    productId,
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
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { signal: controller.signal });
        const output = await response.json();
        if (!response.ok || !Array.isArray(output.products)) return;

        setProducts(output.products.map((product: ProductOption) => ({
          id: Number(product.id),
          title: product.title,
          category: product.category,
        })));
      } catch (caughtError) {
        if (!(caughtError instanceof DOMException && caughtError.name === "AbortError")) {
          console.error("Unable to load product filter options", caughtError);
        }
      }
    }

    void loadProducts();
    return () => controller.abort();
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
    productId ? `Product: ${products.find((product) => String(product.id) === productId)?.title ?? productId}` : "",
    productCategory ? `Category: ${productCategory}` : "",
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
    setProductId("");
    setProductCategory("");
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
    setComparisonProductId("");
    setComparisonProductCategory("");
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
    <article ref={interfaceRef} className={`relative min-h-[500px] rounded-xl border p-3 sm:min-h-[560px] sm:p-4 md:p-6 ${workspaceMode ? "mx-auto max-w-5xl" : ""} ${panel}`}>
      <header className="text-center">
        <h2 className="font-inter text-xl font-semibold leading-snug sm:text-2xl md:text-3xl">
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

      <div className="mt-4 grid grid-cols-6 gap-1.5 sm:mt-6 sm:gap-2 md:grid-cols-5 md:gap-3">
        <details className="group relative col-span-2 md:col-span-1">
          <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 rounded-md border px-2 py-1.5 transition hover:border-sky-400 sm:min-h-14 sm:gap-2 sm:px-3 sm:py-2 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Metric</span>
              <span className="hidden truncate font-inter text-xs font-medium sm:block md:text-sm">{metricLabels[metric]}</span>
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
          <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 rounded-md border px-2 py-1.5 transition hover:border-sky-400 sm:min-h-14 sm:gap-2 sm:px-3 sm:py-2 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Period</span>
              <span className="hidden truncate font-inter text-xs font-medium sm:block md:text-sm">{periodSummary}</span>
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
          <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 rounded-md border px-2 py-1.5 transition hover:border-sky-400 sm:min-h-14 sm:gap-2 sm:px-3 sm:py-2 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Filters</span>
              <span className="hidden truncate font-inter text-xs font-medium sm:block md:text-sm">{joinSummary(activeFilters)}</span>
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
            <label className="block font-inter text-xs font-medium">
              Product
              <select value={productId} onChange={(event) => setProductId(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                <option value="">Any</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
              </select>
            </label>
            <label className="block font-inter text-xs font-medium">
              Product category
              <select value={productCategory} onChange={(event) => setProductCategory(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                <option value="">Any</option>
                {productCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => { setGender(""); setMinimumAge(""); setMaximumAge(""); setLocation(""); setProductId(""); setProductCategory(""); }} className="font-inter text-xs font-medium text-sky-400 hover:text-sky-300">
              Clear filters
            </button>
          </div>
        </details>

        <details className="group relative col-span-3 md:col-span-1">
          <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 rounded-md border px-2 py-1.5 transition hover:border-sky-400 sm:min-h-14 sm:gap-2 sm:px-3 sm:py-2 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Breakdown</span>
              <span className="hidden truncate font-inter text-xs font-medium sm:block md:text-sm">{breakdownCategory ? breakdownLabels[breakdownCategory] : "None"}</span>
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
          <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 rounded-md border px-2 py-1.5 transition hover:border-sky-400 sm:min-h-14 sm:gap-2 sm:px-3 sm:py-2 ${capsule}`}>
            <span className="min-w-0">
              <span className={`block font-inter text-[10px] font-semibold uppercase tracking-[0.1em] ${muted}`}>Compare</span>
              <span className="hidden truncate font-inter text-xs font-medium sm:block md:text-sm">{comparisonSummary}</span>
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
                {comparisonFilterCategory === "productId" && (
                  <label className="block font-inter text-xs font-medium">
                    Compare with
                    <select value={comparisonProductId} onChange={(event) => setComparisonProductId(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                      <option value="">Choose a product</option>
                      {products.filter((product) => String(product.id) !== productId).map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
                    </select>
                  </label>
                )}
                {comparisonFilterCategory === "productCategory" && (
                  <label className="block font-inter text-xs font-medium">
                    Compare with
                    <select value={comparisonProductCategory} onChange={(event) => setComparisonProductCategory(event.target.value)} className={`mt-1 w-full rounded-md border p-2 font-inter text-sm ${field}`}>
                      <option value="">Choose a product category</option>
                      {productCategories.filter((category) => category !== productCategory).map((category) => <option key={category} value={category}>{category}</option>)}
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

      <div className="relative mt-4 min-h-[350px] overflow-hidden rounded-lg sm:mt-6 sm:min-h-[400px] md:mt-8">
        {error ? (
          <div className="flex min-h-[350px] items-center justify-center p-4 text-center font-inter text-sm text-rose-400 sm:min-h-[400px] sm:p-6">{error}</div>
        ) : isLoading && result === null ? (
          <div className={`flex min-h-[350px] items-center justify-center font-inter text-sm sm:min-h-[400px] ${muted}`}>Loading chart…</div>
        ) : points.length === 0 ? (
          <div className={`flex min-h-[350px] items-center justify-center p-4 text-center font-inter text-sm sm:min-h-[400px] sm:p-6 ${muted}`}>No data was found for this configuration.</div>
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
                <div className="mt-6 min-h-[400px] overflow-hidden rounded-lg">
                  <ResultVisualisation result={savedChart.result} lightMode={lightMode} compact />
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
