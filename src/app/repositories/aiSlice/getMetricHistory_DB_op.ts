import { prisma } from "@/server/db";
import type { Period } from "@/app/types/slice3MetricsAndHistory/analysisRequest";
import type { MetricHistoryPeriodOutput } from "@/app/types/slice3MetricsAndHistory/analysisData";

export async function getMetricHistory_DB_op(
  period: Period
): Promise<MetricHistoryPeriodOutput[]> {
  const [startDate, endDate] = period.dateRange;

  const history = await prisma.$queryRaw<MetricHistoryPeriodOutput[]>`
    WITH grouped_history AS (
      SELECT
        date_trunc(${period.interval}, "businessDate")::date AS "periodStart",
        SUM("revenue") AS "revenue",
        SUM("orders") AS "orders",
        SUM("itemsSold") AS "itemsSold"
      FROM "daily_metric_history"
      WHERE "businessDate" >= CAST(${startDate} AS date)
        AND "businessDate" <= CAST(${endDate} AS date)
      GROUP BY "periodStart"
    )
    SELECT
      GREATEST("periodStart", CAST(${startDate} AS date)) AS "startDate",
      LEAST(
        CASE
          WHEN ${period.interval} = 'day' THEN "periodStart"
          WHEN ${period.interval} = 'week' THEN "periodStart" + 6
          ELSE ("periodStart" + INTERVAL '1 month' - INTERVAL '1 day')::date
        END,
        CAST(${endDate} AS date)
      ) AS "endDate",
      "revenue",
      "orders",
      "itemsSold"
    FROM grouped_history
    ORDER BY "periodStart" ASC
  `;

  return history;
}
