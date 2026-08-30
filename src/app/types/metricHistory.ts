export type PersistedMetric =
  | "revenue"
  | "customers"
  | "orders"
  | "itemsSold";

export interface MetricHistoryOutput {
  id: number;
  businessDate: Date | string;
  revenue: unknown;
  customers: number | null;
  orders: number;
  itemsSold: number;
  calculatedAt: Date | string;
  calculationVersion: number;
}

export interface MetricHistoryPoint {
  date: string;
  value: number;
}

export interface MetricHistoryMetricResult {
  total: number;
  series: {
    interval: "day";
    periods: MetricHistoryPoint[];
  };
}

export type MetricHistoryResult = Partial<
  Record<PersistedMetric, MetricHistoryMetricResult>
>;
