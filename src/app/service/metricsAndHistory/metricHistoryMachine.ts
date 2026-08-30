import { getMetricHistory_DB_op } from "../../repositories/aiSlice/getMetricHistory_DB_op"
import type { AnalysisRequest } from "@/app/types/analysisMachine";
import type {
  MetricHistoryResult,
  PersistedMetric,
} from "@/app/types/metricHistory";

const persistedMetrics: PersistedMetric[] = [
  "revenue",
  "customers",
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
): Promise<MetricHistoryResult> {
  if (request.metrics.length !== 1) {
    throw new Error("Metric history requests currently require exactly one metric");
  }

  if (!request.period) {
    throw new Error("Metric history requests require a date period");
  }

  const metric = request.metrics[0];

  if (!isPersistedMetric(metric)) {
    throw new Error(`${metric} is not stored in metric history`);
  }

  const history = await getMetricHistory_DB_op(request.period);
  const periods = history.map((row) => ({
    date: formatBusinessDate(row.businessDate),
    value: Number(row[metric]),
  }));
  const total = periods.reduce((sum, period) => sum + period.value, 0);

  const result: MetricHistoryResult = {};
  result[metric] = {
    total,
    series: {
      interval: request.period.interval,
      periods,
    },
  };

  return result;
}
