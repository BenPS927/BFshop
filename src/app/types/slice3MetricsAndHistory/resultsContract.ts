export type ResultsContract = {
  title: string;
  chartType: "figure" | "bar" | "line" | "scatter";
  metric: "revenue" | "orders" | "itemsSold";
  interval?: "day" | "week" | "month";
  axes: { x: { unit: "date" | "number" | "category"; };
          y: { key: string;
               label: string;
               unit: "currency" | "count" | "percentage" | "number";
             }[];
        };
  series: { key: string;
            label: string;
            yAxisKey: string;
            points: { x: string | number;
                      y: number;}[];
          }[];
};
