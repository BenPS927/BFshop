import { getMetricHistory_DB_op } from "../../repositories/aiSlice/getMetricHistory_DB_op"
import type { AnalysisRequest, PersistedMetric } from "@/app/types/slice3MetricsAndHistory/analysisRequest";
import type {
  ResultsContract,
} from "@/app/types/slice3MetricsAndHistory/resultsContract";

const persistedMetrics: PersistedMetric[] = [
  "revenue",
  "orders",
  "itemsSold",
];

function isPersistedMetric(metric: string): metric is PersistedMetric {
  return persistedMetrics.includes(metric as PersistedMetric);
}

function formatBusinessDate(date: Date | string): string {
  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export async function metricHistoryMachine(
  request: AnalysisRequest
): Promise<ResultsContract> {
  if (request.metrics.length !== 1) {
    throw new Error("Metric history requests currently require exactly one metric");
  }

  if (!request.period?.interval) {
    throw new Error("Metric history requests currently require a date period and interval");
  }

  const metric = request.metrics[0];

  if (!isPersistedMetric(metric)) {
    throw new Error(`${metric} is not stored in metric history`);
  }

  const history = await getMetricHistory_DB_op(request.period);
  const label = metric === "itemsSold"
    ? "Items sold"
    : metric[0].toUpperCase() + metric.slice(1);

  return {
    title: `${label} over time`,
    chartType: "line",
    metric,
    interval: request.period.interval,
    axes: {
      x: { unit: "date" },
      y: [{
        key: metric,
        label,
        unit: metric === "revenue" ? "currency" : "count",
      }],
    },
    series: [{
      key: `metric:${metric}`,
      label,
      yAxisKey: metric,
      points: history.map((row) => ({
        x: formatBusinessDate(row.startDate),
        y: Number(row[metric]),
      })),
    }],
  };
}
