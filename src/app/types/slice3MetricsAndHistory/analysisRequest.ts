export type AnalysisRequest = {
  metrics: Metric[];
  period?: Period;
  filters?: Filter[];
};

export type Metric =
  | "revenue"
  | "orders"
  | "itemsSold";

export type PersistedMetric = Metric;

export type Filter =
  | {
      category: "gender";
      parameters: string;
    }
  | {
      category: "age";
      parameters: [number, number];
    }
  | {
      category: "location";
      parameters: string;
    };

export type Period = {
  dateRange: [string, string];
  interval: "day" | "week" | "month";
};
