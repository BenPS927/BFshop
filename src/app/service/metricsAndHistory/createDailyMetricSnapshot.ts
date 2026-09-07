import { metricAnalysisService } from "./metricAnalysisService";
import { writeDailyMetricHistory_DB_op } from "../../repositories/aiSlice/writeDailyMetricHistory_DB_op";

export async function createDailyMetricSnapshot(
  businessDate: string
): Promise<void> {
  const period = {
    dateRange: [businessDate, businessDate] as [string, string],
    interval: "day" as const,
  };
  const [revenueResult, ordersResult, itemsSoldResult] = await Promise.all([
    metricAnalysisService({ metrics: ["revenue"], period }),
    metricAnalysisService({ metrics: ["orders"], period }),
    metricAnalysisService({ metrics: ["itemsSold"], period }),
  ]);

  const revenue = revenueResult.series[0]?.points[0]?.y;
  const orders = ordersResult.series[0]?.points[0]?.y;
  const itemsSold = itemsSoldResult.series[0]?.points[0]?.y;

  if (revenue === undefined || orders === undefined || itemsSold === undefined) {
    throw new Error("Daily metrics were not calculated");
  }

  await writeDailyMetricHistory_DB_op({
    businessDate,
    revenue,
    customers: null,
    orders,
    itemsSold,
  });
}
