export type AnalysisRequest = {
  metrics: ("revenue" | "orders" | "itemsSold")[];

  period?: {
    dateRange: [string, string];
    interval?: "day" | "week" | "month";
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

  breakdown?: {
    category: "gender" | "age" | "location";
  };

  comparison?: (
    { category: "metric";
      metric: "revenue" | "orders" | "itemsSold";
    }
    | { category: "period";
        dateRange: [string, string];
      }
    | { category: "filter";
        filter: ({ category: "gender";
                   parameters: string;
                 }
                 | { category: "age";
                     parameters: [number, number];
                   }
                 | { category: "location";
                     parameters: string;
                   });
      }
  );
};

export type Metric = AnalysisRequest["metrics"][number];
export type PersistedMetric = Metric;
export type Period = NonNullable<AnalysisRequest["period"]>;
export type Filter = NonNullable<AnalysisRequest["filters"]>[number];
export type Breakdown = NonNullable<AnalysisRequest["breakdown"]>;
export type Comparison = NonNullable<AnalysisRequest["comparison"]>;
