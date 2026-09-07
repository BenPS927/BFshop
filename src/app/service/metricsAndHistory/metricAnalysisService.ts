import type { AnalysisRequest } from "../../types/slice3MetricsAndHistory/analysisRequest"
import type { Prisma } from "@/generated/prisma/client"
import { getOrdersForAnalysis_DB_op } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op"
import { groupOrdersByInterval } from "../../analytics/timeSeries/groupOrdersByInterval"
import { totalItemsSold, totalRevenue, totalSales } from "../../analytics/totals/totals"
import type { ResultsContract } from "../../types/slice3MetricsAndHistory/resultsContract"

type ResultSeries = ResultsContract["series"][number]
type RequestMetric = AnalysisRequest["metrics"][number]
type RequestFilter = NonNullable<AnalysisRequest["filters"]>[number]

const metricLabels: Record<RequestMetric, string> = {
    revenue: "Revenue",
    orders: "Orders",
    itemsSold: "Items sold",
}

function describeFilter(filter: RequestFilter): string {
    if (filter.category === "age") {
        return `age: ${filter.parameters[0]}–${filter.parameters[1]}`
    }

    return `${filter.category}: ${filter.parameters}`
}

function buildTitle(request: AnalysisRequest, metric: RequestMetric): string {
    const filters = request.filters?.map(describeFilter) ?? []
    const groups = request.groups ?? []
    const filterText = filters.length > 0
        ? ` filtered by ${filters.join(" and ")}`
        : ""
    const groupText = groups.length > 0
        ? ` divided by ${groups.join(" and ")}`
        : ""

    return `${metricLabels[metric]} over time${filterText}${groupText}`
}

function createTimeSeries<TOrder extends { created_at: Date }>(
    metric: RequestMetric,
    orders: TOrder[],
    request: AnalysisRequest,
    calculate: (intervalOrders: TOrder[]) => number,
): ResultSeries {
    const intervalGroups = groupOrdersByInterval(orders, request.period)

    return {
        key: `metric:${metric}`,
        label: metricLabels[metric],
        points: intervalGroups.map((group) => ({
            x: group.startDate,
            y: calculate(group.orders),
        })),
    }
}

export async function metricAnalysisService(
    request: AnalysisRequest,
): Promise<ResultsContract> {
    const metric = request.metrics[0]

    if (!metric) {
        throw new Error("A metric is required")
    }

    const [startDate, endDate] = request.period.dateRange
    const endDateExclusive = new Date(`${endDate}T00:00:00.000Z`)
    endDateExclusive.setUTCDate(endDateExclusive.getUTCDate() + 1)
    const customerWhere: Prisma.CustomerWhereInput = {}

    for (const filter of request.filters ?? []) {
        if (filter.category === "gender") {
            customerWhere.gender = filter.parameters
        }

        if (filter.category === "age") {
            customerWhere.age = {
                gte: filter.parameters[0],
                lte: filter.parameters[1],
            }
        }

        if (filter.category === "location") {
            customerWhere.address = {
                contains: filter.parameters,
                mode: "insensitive",
            }
        }
    }

    const hasCustomerFilters = Object.keys(customerWhere).length > 0

    const query = {
        where: {
            created_at: {
                gte: new Date(startDate),
                lt: endDateExclusive,
            },
            ...(hasCustomerFilters ? { customer: customerWhere } : {}),
        },
        orderBy: {
            created_at: "asc" as const,
        },
    }

    let timeSeries: ResultSeries

    if (metric === "revenue") {
        const orders = await getOrdersForAnalysis_DB_op({
            ...query,
            select: {
                created_at: true,
                total: true,
            },
        })

        timeSeries = createTimeSeries(metric, orders, request, totalRevenue)
    } else if (metric === "orders") {
        const orders = await getOrdersForAnalysis_DB_op({
            ...query,
            select: {
                created_at: true,
            },
        })

        timeSeries = createTimeSeries(metric, orders, request, totalSales)
    } else {
        const orders = await getOrdersForAnalysis_DB_op({
            ...query,
            select: {
                created_at: true,
                orderItems: {
                    select: {
                        quantity: true,
                    },
                },
            },
        })

        timeSeries = createTimeSeries(metric, orders, request, totalItemsSold)
    }

    return {
        title: buildTitle(request, metric),
        metric,
        interval: request.period.interval,
        axes: {
            x: {
                unit: "date",
            },
            y: {
                unit: metric === "revenue" ? "currency" : "count",
            },
        },
        series: [timeSeries],
    }
}
