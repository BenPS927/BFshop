"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import type { MetricResult } from "@/app/types/slice3MetricsAndHistory/resultsContract";

type RevenueChartsProps = {
  lightMode: boolean;
  revenue: MetricResult;
};

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function RevenueCharts({ lightMode, revenue }: RevenueChartsProps) {
  if (!revenue.series) {
    return null;
  }

  const dates = revenue.series.periods.map((period) =>
    period.startDate === period.endDate
      ? formatDate(period.startDate)
      : `${formatDate(period.startDate)}–${formatDate(period.endDate)}`
  );
  const dailyRevenue = revenue.series.periods.map((period) => period.value);

  let runningTotal = 0;
  const cumulativeRevenue = dailyRevenue.map((value) => {
    runningTotal += value;
    return runningTotal;
  });

  const chartText = lightMode ? "#18181b" : "#f4f4f5";
  const chartGrid = lightMode ? "#d4d4d8" : "rgba(255,255,255,0.15)";
  const chartSeries = lightMode ? "#0369a1" : "#38bdf8";
  const chartStyles = {
    "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: chartGrid },
    "& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label": { fill: chartText },
    "& .MuiChartsGrid-line": { stroke: chartGrid },
  };
  const xAxis = [{
    data: dates,
    scaleType: "band" as const,
    label: "Date",
    tickLabelInterval: "auto" as const,
  }];
  const yAxis = [{
    label: "Revenue (AUD)",
    valueFormatter: (value: number) => currencyFormatter.format(value),
    width: 76,
  }];
  const panel = lightMode
    ? "border-zinc-300 bg-white text-zinc-950"
    : "border-white/15 bg-white/[0.07] text-white";
  const muted = lightMode ? "text-zinc-600" : "text-zinc-400";

  return (
    <section className="mt-6 space-y-6 md:mt-8 md:space-y-8 lg:mt-12 lg:space-y-12">
      <header>
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">
          Visual analysis
        </p>
        <h2 className="mt-2 font-inter text-2xl font-semibold md:text-3xl lg:text-4xl">
          Revenue over time
        </h2>
        <p className={`mt-2 font-inter text-sm leading-relaxed md:text-base ${muted}`}>
          Total revenue for this range: {currencyFormatter.format(revenue.total)}
        </p>
      </header>

      <div className="grid gap-4 md:gap-6 lg:gap-8">
        <article className={`rounded-lg border p-4 md:p-6 ${panel}`}>
          <h3 className="mb-3 font-inter text-xl font-semibold md:mb-4 md:text-2xl">
            Daily revenue trend
          </h3>
          <LineChart
            height={360}
            xAxis={xAxis}
            yAxis={yAxis}
            series={[{
              data: dailyRevenue,
              label: "Daily revenue",
              color: chartSeries,
              valueFormatter: (value) => currencyFormatter.format(value ?? 0),
              showMark: true,
            }]}
            grid={{ horizontal: true }}
            hideLegend
            margin={{ left: 12, right: 20, top: 20, bottom: 16 }}
            sx={chartStyles}
          />
        </article>

        <article className={`rounded-lg border p-4 md:p-6 ${panel}`}>
          <h3 className="mb-3 font-inter text-xl font-semibold md:mb-4 md:text-2xl">
            Daily revenue comparison
          </h3>
          <BarChart
            height={360}
            xAxis={xAxis}
            yAxis={yAxis}
            series={[{
              data: dailyRevenue,
              label: "Daily revenue",
              color: chartSeries,
              valueFormatter: (value) => currencyFormatter.format(value ?? 0),
            }]}
            grid={{ horizontal: true }}
            hideLegend
            margin={{ left: 12, right: 20, top: 20, bottom: 16 }}
            sx={chartStyles}
          />
        </article>

        <article className={`rounded-lg border p-4 md:p-6 ${panel}`}>
          <h3 className="mb-3 font-inter text-xl font-semibold md:mb-4 md:text-2xl">
            Cumulative revenue
          </h3>
          <LineChart
            height={360}
            xAxis={xAxis}
            yAxis={yAxis}
            series={[{
              data: cumulativeRevenue,
              label: "Cumulative revenue",
              color: chartSeries,
              valueFormatter: (value) => currencyFormatter.format(value ?? 0),
              showMark: true,
            }]}
            grid={{ horizontal: true }}
            hideLegend
            margin={{ left: 12, right: 20, top: 20, bottom: 16 }}
            sx={chartStyles}
          />
        </article>
      </div>
    </section>
  );
}
