import type { AnalysisRequest } from "@/app/types/analysisMachine";
import { analysisMachine } from "@/app/service/metricsAndHistory/analysisMachine";
import { metricHistoryMachine } from "@/app/service/metricsAndHistory/metricHistoryMachine";
import type { PersistedMetric } from "@/app/types/metricHistory";

const persistedMetrics: PersistedMetric[] = [
    "revenue",
    "customers",
    "orders",
    "itemsSold",
];

export async function requestRouter(request: AnalysisRequest) {
    const requestedMetric = request.metrics[0];
    const hasOnePersistedMetric =
        request.metrics.length === 1 &&
        persistedMetrics.includes(requestedMetric as PersistedMetric);
    const hasNoFilters = (request.filters?.length ?? 0) === 0;
    const canUseMetricHistory =
        request.period !== undefined &&
        hasNoFilters &&
        hasOnePersistedMetric;

    if (canUseMetricHistory) {
        return metricHistoryMachine(request);
    }

    return analysisMachine(request);
}
