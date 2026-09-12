export type AnalysisRequest = {
  metrics: ("revenue" | "orders" | "itemsSold" | "averageOrderValue" | "averageItemsPerOrder" | "averageItemValue")[];

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
               }
             | { category: "productId";
                 parameters: number;
               }
             | { category: "productCategory";
                 parameters: string;
               }
              )[];

  breakdown?: {
    category: "gender" | "age" | "location" | "productId" | "productCategory";
  };

  comparison?: ({ category: "metric";
                   metric: "revenue" | "orders" | "itemsSold" | "averageOrderValue" | "averageItemsPerOrder" | "averageItemValue";
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
                              }
                            | { category: "productId";
                                parameters: number;
                              }
                            | { category: "productCategory";
                                parameters: string;
                              });
                 });
};

export type Metric = AnalysisRequest["metrics"][number];
export type PersistedMetric =
  | "revenue"
  | "orders"
  | "itemsSold";
export type Period = NonNullable<AnalysisRequest["period"]>;
export type Filter = NonNullable<AnalysisRequest["filters"]>[number];
export type Breakdown = NonNullable<AnalysisRequest["breakdown"]>;
export type Comparison = NonNullable<AnalysisRequest["comparison"]>;
