import type { AnalysisRequest } from "../../types/slice3MetricsAndHistory/analysisRequest"
import type { ResultsContract } from "../../types/slice3MetricsAndHistory/resultsContract"
import { metricAnalysisService } from "./metricAnalysisService"

/** Legacy entry point retained for callers not yet moved to the current service. */
export async function analysisMachine(
    request: AnalysisRequest,
): Promise<ResultsContract> {
    return metricAnalysisService(request)
}
