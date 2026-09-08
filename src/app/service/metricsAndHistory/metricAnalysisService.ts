import type { Prisma } from "@/generated/prisma/client"
import { syntheticSuburbs } from "@/data/syntheticEconomy/locations"
import { groupOrdersByInterval } from "../../analytics/timeSeries/groupOrdersByInterval"
import { getOrdersForAnalysis_DB_op } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op"
import type {
    AnalysisRequest,
    Filter,
    Metric,
    Period,
} from "../../types/slice3MetricsAndHistory/analysisRequest"
import type { ResultsContract } from "../../types/slice3MetricsAndHistory/resultsContract"

type ResultSeries = ResultsContract["series"][number]
type BreakdownCategory = NonNullable<AnalysisRequest["breakdown"]>["category"]

type AnalysisOrder = {
    created_at: Date
    total?: number
    orderItems?: { quantity: number }[]
    customer?: { gender?: string; age?: number; address?: string }
}

type MetricScope = { key: string; label: string; metric: Metric }
type CustomerScope = { key: string; label: string; customerWhere: Prisma.CustomerWhereInput }
type PeriodScope = { key: string; label: string; period?: Period }
type BreakdownValue = {
    key: string
    label: string
    matches: (order: AnalysisOrder) => boolean
}

const maximumTimeSeries = 10

const metricLabels: Record<Metric, string> = {
    revenue: "Revenue",
    orders: "Orders",
    itemsSold: "Items sold",
}

const categoryLabels: Record<BreakdownCategory, string> = {
    gender: "gender",
    age: "age group",
    location: "neighbourhood",
}

function describeFilter(filter: Filter): string {
    if (filter.category === "age") return `age ${filter.parameters[0]}–${filter.parameters[1]}`
    return `${filter.category} ${filter.parameters}`
}

function describeFilterValue(filter: Filter): string {
    if (filter.category === "age") return `${filter.parameters[0]}–${filter.parameters[1]}`
    return filter.parameters
}

function filterValueKey(filter: Filter): string {
    return filter.category === "age" ? filter.parameters.join("-") : filter.parameters
}

function formatDateRange([startDate, endDate]: [string, string]): string {
    const formatter = new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })
    const start = formatter.format(new Date(`${startDate}T00:00:00.000Z`))
    const end = formatter.format(new Date(`${endDate}T00:00:00.000Z`))
    return startDate === endDate ? start : `${start}–${end}`
}

function buildTitle(request: AnalysisRequest, metric: Metric): string {
    const filters = request.filters?.map(describeFilter) ?? []
    const filterText = filters.length > 0 ? ` for ${filters.join(" and ")}` : ""
    const breakdownText = request.breakdown
        ? ` by ${categoryLabels[request.breakdown.category]}`
        : ""
    const timeText = request.period?.interval ? " over time" : ""
    let comparisonText = ""

    if (request.comparison?.category === "metric") {
        comparisonText = ` compared with ${metricLabels[request.comparison.metric]}`
    }
    if (request.comparison?.category === "period") comparisonText = " compared across periods"
    if (request.comparison?.category === "filter") {
        comparisonText = ` compared by ${categoryLabels[request.comparison.filter.category]}`
    }

    return `${metricLabels[metric]}${timeText}${filterText}${breakdownText}${comparisonText}`
}

function addFilterToCustomerWhere(customerWhere: Prisma.CustomerWhereInput, filter: Filter): void {
    if (filter.category === "gender") customerWhere.gender = filter.parameters
    if (filter.category === "age") {
        customerWhere.age = { gte: filter.parameters[0], lte: filter.parameters[1] }
    }
    if (filter.category === "location") {
        customerWhere.address = { contains: filter.parameters, mode: "insensitive" }
    }
}

function buildMetricScopes(request: AnalysisRequest, primaryMetric: Metric): MetricScope[] {
    const scopes: MetricScope[] = [{
        key: primaryMetric,
        label: metricLabels[primaryMetric],
        metric: primaryMetric,
    }]

    if (request.comparison?.category === "metric") {
        const comparisonMetric = request.comparison.metric
        if (comparisonMetric === primaryMetric) throw new Error("Choose a different metric to compare")
        scopes.push({
            key: comparisonMetric,
            label: metricLabels[comparisonMetric],
            metric: comparisonMetric,
        })
    }

    return scopes
}

function buildCustomerScopes(request: AnalysisRequest): CustomerScope[] {
    const filters = request.filters ?? []
    const comparison = request.comparison

    if (comparison?.category !== "filter") {
        const customerWhere: Prisma.CustomerWhereInput = {}
        filters.forEach((filter) => addFilterToCustomerWhere(customerWhere, filter))
        return [{ key: "selected", label: "Selected customers", customerWhere }]
    }

    const alternative = comparison.filter
    const original = filters.find((filter) => filter.category === alternative.category)
    if (!original) throw new Error(`Select a ${alternative.category} filter before comparing it`)
    if (filterValueKey(original) === filterValueKey(alternative)) {
        throw new Error("Choose a different filter value to compare")
    }

    const baseFilters = filters.filter((filter) => filter.category !== alternative.category)
    return [original, alternative].map((selectedFilter) => {
        const customerWhere: Prisma.CustomerWhereInput = {}
        baseFilters.forEach((filter) => addFilterToCustomerWhere(customerWhere, filter))
        addFilterToCustomerWhere(customerWhere, selectedFilter)
        return {
            key: `${selectedFilter.category}:${filterValueKey(selectedFilter)}`,
            label: describeFilterValue(selectedFilter),
            customerWhere,
        }
    })
}

function buildPeriodScopes(request: AnalysisRequest): PeriodScope[] {
    const primaryPeriod = request.period
    const comparison = request.comparison

    if (!primaryPeriod) {
        if (comparison?.category === "period") {
            throw new Error("Select a primary period before comparing periods")
        }
        return [{ key: "all-time", label: "All time" }]
    }

    const primaryScope: PeriodScope = {
        key: primaryPeriod.dateRange.join(":"),
        label: formatDateRange(primaryPeriod.dateRange),
        period: primaryPeriod,
    }
    if (comparison?.category !== "period") return [primaryScope]
    if (comparison.dateRange.join(":") === primaryScope.key) {
        throw new Error("Choose a different period to compare")
    }

    return [primaryScope, {
        key: comparison.dateRange.join(":"),
        label: formatDateRange(comparison.dateRange),
        period: { dateRange: comparison.dateRange, interval: primaryPeriod.interval },
    }]
}

function getBreakdownValues(category: BreakdownCategory): BreakdownValue[] {
    if (category === "gender") {
        return ["female", "male"].map((gender) => ({
            key: gender,
            label: gender[0].toUpperCase() + gender.slice(1),
            matches: (order) => order.customer?.gender?.toLowerCase() === gender,
        }))
    }
    if (category === "location") {
        return syntheticSuburbs.map((suburb) => ({
            key: suburb,
            label: suburb,
            matches: (order) => order.customer?.address?.toLowerCase().includes(suburb.toLowerCase()) ?? false,
        }))
    }

    const ageGroups = [
        { key: "18-29", label: "18–29", minimum: 18, maximum: 29 },
        { key: "30-39", label: "30–39", minimum: 30, maximum: 39 },
        { key: "40-49", label: "40–49", minimum: 40, maximum: 49 },
        { key: "50-59", label: "50–59", minimum: 50, maximum: 59 },
        { key: "60+", label: "60+", minimum: 60, maximum: Number.POSITIVE_INFINITY },
    ]
    return ageGroups.map((group) => ({
        key: group.key,
        label: group.label,
        matches: (order) => {
            const age = order.customer?.age
            return age !== undefined && age >= group.minimum && age <= group.maximum
        },
    }))
}

function buildOrderSelect(metric: Metric, needsCustomer: boolean): Prisma.OrderSelect {
    return {
        created_at: true,
        ...(metric === "revenue" ? { total: true } : {}),
        ...(metric === "itemsSold" ? { orderItems: { select: { quantity: true } } } : {}),
        ...(needsCustomer ? {
            customer: { select: { gender: true, age: true, address: true } },
        } : {}),
    }
}

function dateWhere(period?: Period): Prisma.DateTimeFilter | undefined {
    if (!period) return undefined
    const [startDate, endDate] = period.dateRange
    const endDateExclusive = new Date(`${endDate}T00:00:00.000Z`)
    endDateExclusive.setUTCDate(endDateExclusive.getUTCDate() + 1)
    return { gte: new Date(`${startDate}T00:00:00.000Z`), lt: endDateExclusive }
}

async function fetchOrders(
    metric: Metric,
    periodScope: PeriodScope,
    customerScope: CustomerScope,
    needsCustomer: boolean,
): Promise<AnalysisOrder[]> {
    const createdAt = dateWhere(periodScope.period)
    const hasCustomerWhere = Object.keys(customerScope.customerWhere).length > 0
    const orders = await getOrdersForAnalysis_DB_op({
        where: {
            ...(createdAt ? { created_at: createdAt } : {}),
            ...(hasCustomerWhere ? { customer: customerScope.customerWhere } : {}),
        },
        orderBy: { created_at: "asc" },
        select: buildOrderSelect(metric, needsCustomer),
    })
    return orders as AnalysisOrder[]
}

function calculateMetric(metric: Metric, orders: AnalysisOrder[]): number {
    if (metric === "orders") return orders.length
    if (metric === "revenue") {
        return orders.reduce((total, order) => total + Number(order.total ?? 0), 0)
    }
    return orders.reduce(
        (orderTotal, order) => orderTotal + (order.orderItems ?? []).reduce(
            (itemTotal, item) => itemTotal + item.quantity,
            0,
        ),
        0,
    )
}

function relativeIntervalLabel(interval: NonNullable<Period["interval"]>, index: number): string {
    const label = interval === "day" ? "Day" : interval === "week" ? "Week" : "Month"
    return `${label} ${index + 1}`
}

function seriesLabel(
    metricScope: MetricScope,
    periodScope: PeriodScope,
    customerScope: CustomerScope,
    breakdownValue: BreakdownValue | undefined,
    counts: { metrics: number; periods: number; customers: number },
): string {
    return [
        counts.metrics > 1 ? metricScope.label : "",
        counts.periods > 1 ? periodScope.label : "",
        counts.customers > 1 ? customerScope.label : "",
        breakdownValue?.label ?? "",
    ].filter(Boolean).join(" · ") || metricScope.label
}

function validateRequest(request: AnalysisRequest): Metric {
    const metric = request.metrics[0]
    if (!metric) throw new Error("A metric is required")
    if (request.metrics.length > 1) throw new Error("Select one primary metric and use comparison for the alternative")

    const comparedFilterCategory = request.comparison?.category === "filter"
        ? request.comparison.filter.category
        : undefined
    if (request.breakdown && request.breakdown.category === comparedFilterCategory) {
        throw new Error("A breakdown cannot also be the selected comparison")
    }
    if (request.breakdown) {
        const conflictingFilter = request.filters?.some((filter) => filter.category === request.breakdown?.category)
        if (conflictingFilter) {
            throw new Error(`Remove the ${request.breakdown.category} filter before breaking down by ${request.breakdown.category}`)
        }
    }
    return metric
}

export async function metricAnalysisService(request: AnalysisRequest): Promise<ResultsContract> {
    const primaryMetric = validateRequest(request)
    const metricScopes = buildMetricScopes(request, primaryMetric)
    const periodScopes = buildPeriodScopes(request)
    const customerScopes = buildCustomerScopes(request)
    const breakdownValues = request.breakdown ? getBreakdownValues(request.breakdown.category) : []
    const hasInterval = Boolean(request.period?.interval)
    const needsCustomer = Boolean(request.breakdown)
    const counts = {
        metrics: metricScopes.length,
        periods: periodScopes.length,
        customers: customerScopes.length,
    }

    const fetchedScopes = await Promise.all(
        metricScopes.flatMap((metricScope) => periodScopes.flatMap((periodScope) =>
            customerScopes.map(async (customerScope) => ({
                metricScope,
                periodScope,
                customerScope,
                orders: await fetchOrders(metricScope.metric, periodScope, customerScope, needsCustomer),
            })),
        )),
    )

    let series: ResultSeries[]
    let chartType: ResultsContract["chartType"]
    let xUnit: ResultsContract["axes"]["x"]["unit"]

    if (hasInterval) {
        const comparesPeriods = periodScopes.length > 1
        series = fetchedScopes.flatMap(({ metricScope, periodScope, customerScope, orders }) => {
            if (!periodScope.period?.interval) return []
            const intervalGroups = groupOrdersByInterval(orders, periodScope.period)
            const groups = breakdownValues.length > 0
                ? breakdownValues
                : [{ key: "all", label: "", matches: () => true }]

            return groups.map((group) => ({
                key: [metricScope.key, periodScope.key, customerScope.key, group.key].join("|"),
                label: seriesLabel(metricScope, periodScope, customerScope, group, counts),
                yAxisKey: metricScope.key,
                points: intervalGroups.map((intervalGroup, index) => ({
                    x: comparesPeriods
                        ? relativeIntervalLabel(periodScope.period!.interval!, index)
                        : intervalGroup.startDate,
                    y: calculateMetric(metricScope.metric, intervalGroup.orders.filter(group.matches)),
                })),
            }))
        })
        if (series.length > maximumTimeSeries) {
            throw new Error(`This selection would create ${series.length} lines. Time-based charts currently support a maximum of ${maximumTimeSeries}.`)
        }
        chartType = "line"
        xUnit = comparesPeriods ? "category" : "date"
    } else if (breakdownValues.length > 0) {
        series = fetchedScopes.map(({ metricScope, periodScope, customerScope, orders }) => ({
            key: [metricScope.key, periodScope.key, customerScope.key].join("|"),
            label: seriesLabel(metricScope, periodScope, customerScope, undefined, counts),
            yAxisKey: metricScope.key,
            points: breakdownValues.map((breakdownValue) => ({
                x: breakdownValue.label,
                y: calculateMetric(metricScope.metric, orders.filter(breakdownValue.matches)),
            })),
        }))
        chartType = "bar"
        xUnit = "category"
    } else if (metricScopes.length > 1) {
        series = fetchedScopes.map(({ metricScope, periodScope, customerScope, orders }) => ({
            key: [metricScope.key, periodScope.key, customerScope.key].join("|"),
            label: metricScope.label,
            yAxisKey: metricScope.key,
            points: [{
                x: periodScope.label,
                y: calculateMetric(metricScope.metric, orders),
            }],
        }))
        chartType = "bar"
        xUnit = "category"
    } else if (periodScopes.length > 1 || customerScopes.length > 1) {
        series = [{
            key: "comparison",
            label: metricLabels[primaryMetric],
            yAxisKey: primaryMetric,
            points: fetchedScopes.map(({ periodScope, customerScope, metricScope, orders }) => ({
                x: periodScopes.length > 1 ? periodScope.label : customerScope.label,
                y: calculateMetric(metricScope.metric, orders),
            })),
        }]
        chartType = "bar"
        xUnit = "category"
    } else {
        series = [{
            key: `metric:${primaryMetric}`,
            label: metricLabels[primaryMetric],
            yAxisKey: primaryMetric,
            points: [{ x: periodScopes[0].label, y: calculateMetric(primaryMetric, fetchedScopes[0]?.orders ?? []) }],
        }]
        chartType = "figure"
        xUnit = "category"
    }

    return {
        title: buildTitle(request, primaryMetric),
        chartType,
        metric: primaryMetric,
        ...(request.period?.interval ? { interval: request.period.interval } : {}),
        axes: {
            x: { unit: xUnit },
            y: metricScopes.map((metricScope) => ({
                key: metricScope.key,
                label: metricScope.label,
                unit: metricScope.metric === "revenue" ? "currency" as const : "count" as const,
            })),
        },
        series,
    }
}
