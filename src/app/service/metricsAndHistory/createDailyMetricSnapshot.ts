import { analysisMachine } from "./analysisMachine";
import { writeDailyMetricHistory_DB_op } from "../../repositories/aiSlice/writeDailyMetricHistory_DB_op";

export async function createDailyMetricSnapshot(
  businessDate: string
): Promise<void> {
  const analysisResult = await analysisMachine({
    metrics: ["revenue", "orders", "itemsSold"],
    period: {
      dateRange: [businessDate, businessDate],
      interval: "day",
    },
  });

  if (!analysisResult.revenue) {
    throw new Error("Daily revenue was not calculated");
  }

  if (!analysisResult.orders) {
    throw new Error("Daily orders were not calculated");
  }

  if (!analysisResult.itemsSold) {
    throw new Error("Daily items sold were not calculated");
  }

  await writeDailyMetricHistory_DB_op({
    businessDate,
    revenue: analysisResult.revenue.total,
    customers: null,
    orders: analysisResult.orders.total,
    itemsSold: analysisResult.itemsSold.total,
  });
}
