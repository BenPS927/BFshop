export type Orders = {
  customer_id: number;
  id: number;
  status: string;
  total: number;
  created_at: Date;
  customer: Customer;
  orderItems: OrderItem[];
};

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

export interface MetricHistoryPeriodOutput {
  startDate: Date | string;
  endDate: Date | string;
  revenue: unknown;
  orders: number | bigint;
  itemsSold: number | bigint;
}
