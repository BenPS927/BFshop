export interface CreateOrderRequest {
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
}