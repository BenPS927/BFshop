import { prisma } from "@/server/db";
import type { Period } from "@/app/types/analysisMachine";
import type { MetricHistoryOutput } from "@/app/types/metricHistory";

export async function getMetricHistory_DB_op(
  period: Period
): Promise<MetricHistoryOutput[]> {
  const [startDate, endDate] = period.dateRange;

  const history = await prisma.$queryRaw<MetricHistoryOutput[]>`
    SELECT
      "id",
      "businessDate",
      "revenue",
      "customers",
      "orders",
      "itemsSold",
      "calculatedAt",
      "calculationVersion"
    FROM "daily_metric_history"
    WHERE "businessDate" >= CAST(${startDate} AS date)
      AND "businessDate" <= CAST(${endDate} AS date)
    ORDER BY "businessDate" ASC
  `;

  return history;
}
