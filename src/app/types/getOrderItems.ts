export type OrderItemDetail = {
  id: number;
  product_name: string;
  line_total: number;
  quantity: number;
};

export type OrderItemsResult = OrderItemDetail[];
