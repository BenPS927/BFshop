export type AnalysisRequest = {
  metrics: ("revenue" | "orders" | "itemsSold")[];
  period: { dateRange: [string, string];
             interval: "day" | "week" | "month";
           };
  filters?: ({ category: "gender";
               parameters: string;
             }
             | { category: "age";
                 parameters: [number, number];
               }
             | { category: "location";
                 parameters: string;
               })[];
  groups?: ("gender" | "age" | "location")[];
};

export type Metric = AnalysisRequest["metrics"][number];
export type PersistedMetric = Metric;
export type Period = NonNullable<AnalysisRequest["period"]>;
export type Filter = NonNullable<AnalysisRequest["filters"]>[number];
export type Group = NonNullable<AnalysisRequest["groups"]>[number];
