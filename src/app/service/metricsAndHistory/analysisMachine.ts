import { totalRevenue, totalSales, totalItemsSold } from "../../analytics/totals/totals"
import { getOrdersForAnalysis_DB_op } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op"
import { filterByDate } from "@/app/analytics/filters/filterByDate"
import { filterByGender } from "@/app/analytics/filters/filterByGender"
import { filterByAge } from "@/app/analytics/filters/filterByAge"
import { filterByLocation } from "@/app/analytics/filters/filterByLocation"
import { groupOrdersByInterval } from "@/app/analytics/timeSeries/groupOrdersByInterval"
import type { OrderForAnalysis } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op"
import type { AnalysisRequest } from "../../types/slice3MetricsAndHistory/analysisRequest"
import type { MetricResult, ResultsContract } from "../../types/slice3MetricsAndHistory/resultsContract"

type MetricCalculator = (orders: OrderForAnalysis[]) => number;

function buildMetricResult(
    orders: OrderForAnalysis[],
    request: AnalysisRequest,
    calculate: MetricCalculator
): MetricResult {
    const result: MetricResult = {
        total: calculate(orders),
    };

    if (request.period) {
        result.series = {
            interval: request.period.interval,
            periods: groupOrdersByInterval(orders, request.period).map((group) => ({
                startDate: group.startDate,
                endDate: group.endDate,
                value: calculate(group.orders),
            })),
        };
    }

    return result;
}


export async function analysisMachine(request: AnalysisRequest): Promise<ResultsContract> {

    let orders =  await getOrdersForAnalysis_DB_op()

    if (request.period) {
        orders = filterByDate(orders, request.period);
    }

    const filters = request.filters ?? [];

    for (const filter of filters) {
        if (filter.category === "gender") {
            orders = filterByGender(orders, filter.parameters);
        }
        if (filter.category === "age") {
            orders = filterByAge(orders, filter.parameters);
        }
        if (filter.category === "location") {
            orders = filterByLocation(orders, filter.parameters);
        }
    }

    const results: ResultsContract = {};

    if (request.metrics.includes("revenue")) {
        results.revenue = buildMetricResult(orders, request, totalRevenue)

    } 
    if (request.metrics.includes("orders")) {
        results.orders = buildMetricResult(orders, request, totalSales)
    }

    if (request.metrics.includes("itemsSold")) {
        results.itemsSold = buildMetricResult(orders, request, totalItemsSold)
    }


    return results 

}
