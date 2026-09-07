export type ResultsContract = {
  title: string;
  metric: "revenue" | "orders" | "itemsSold";
  interval?: "day" | "week" | "month";
  axes: { x: { unit: "date" | "number" | "category"; };
          y: { unit: "currency" | "count" | "percentage" | "number";};
        };
  series: { key: string;
            label: string;
            points: { x: string | number;
                      y: number;}[];
          }[];
};
