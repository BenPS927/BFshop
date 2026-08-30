import { totalRevenue, totalSales, totalItemsSold } from "../../analytics/totals/totals"
import { getOrdersForAnalysis_DB_op } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op"
import { filterByDate } from "@/app/analytics/filters/filterByDate"
import { filterByGender } from "@/app/analytics/filters/filterByGender"
import { filterByAge } from "@/app/analytics/filters/filterByAge"
import { filterByLocation } from "@/app/analytics/filters/filterByLocation"
import type { AnalysisRequest, AnalysisResult } from "../../types/analysisMachine"


export async function analysisMachine(request: AnalysisRequest) {

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

    const results: AnalysisResult = {};

    if (request.metrics.includes("revenue")) {
        results.revenue = {
            total: totalRevenue(orders),
        }

    } 
    if (request.metrics.includes("sales")) {
        results.sales = totalSales(orders)
    }

    if (request.metrics.includes("itemsSold")) {
        results.itemsSold = {
            total: totalItemsSold(orders),
        }
    }


    return results 

}
