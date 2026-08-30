export type AnalysisRequest = {
    metrics: Metric[];
    period?: Period;
    filters?: Filter[];
};

export type AnalysisResult = {
    revenue?: RevenueResult;
    sales?: number;
    itemsSold?: ItemsSoldResult;
};

export type RevenueResult = {
    total: number;
    series?: RevenueSeries;
};

export type ItemsSoldResult = {
    total: number;
    series?: RevenueSeries;
};

export type RevenueSeries = {
    interval: "day";
    periods: RevenuePeriod[];
};

export type RevenuePeriod = {
    date: string;
    value: number;
};

export type Metric =
    | "revenue"
    | "sales"
    | "customers"
    | "orders"
    | "itemsSold";

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
    interval: "day";
}

export type Orders = {
    customer_id: number;
    id: number;
    status: string;
    total: number;
    created_at: Date;
    customer: Customer;

    orderItems: OrderItem[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  address: string;
  age: number;
  gender: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  line_total: number; 
  unit_price: number;
  product_name: string;
}
