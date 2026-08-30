import { prisma } from "@/server/db";

export type DailyMetricSnapshot = {
  businessDate: string;
  revenue: number;
  customers: number | null;
  orders: number;
  itemsSold: number;
};

export async function writeDailyMetricHistory_DB_op(
  snapshot: DailyMetricSnapshot
): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "daily_metric_history" (
      "businessDate",
      "revenue",
      "customers",
      "orders",
      "itemsSold"
    )
    VALUES (
      CAST(${snapshot.businessDate} AS date),
      ${snapshot.revenue},
      ${snapshot.customers},
      ${snapshot.orders},
      ${snapshot.itemsSold}
    )
    ON CONFLICT ("businessDate")
    DO UPDATE SET
      "revenue" = EXCLUDED."revenue",
      "customers" = EXCLUDED."customers",
      "orders" = EXCLUDED."orders",
      "itemsSold" = EXCLUDED."itemsSold",
      "calculatedAt" = CURRENT_TIMESTAMP
  `;
}
