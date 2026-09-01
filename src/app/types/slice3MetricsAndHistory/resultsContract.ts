export type ResultsContract = Partial<
  Record<ResultMetric, MetricResult>
>;

export type ResultMetric =
  | "revenue"
  | "orders"
  | "itemsSold";

export type MetricResult = {
  total: number;
  series?: MetricSeries;
};

export type MetricSeries = {
  interval: "day" | "week" | "month";
  periods: MetricPeriod[];
};

export type MetricPeriod = {
  startDate: string;
  endDate: string;
  value: number;
};
