export interface CreateOrderRequest {
  items: OrderItem[];
  customerId: number;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}


export interface ProductsType {
  id: number;
  title: string;
  price: number; 
  stock: number
}

export interface CustomerType {
  id: number
}

export interface BackendOrderItem {
  product_id: number;
  quantity: number;
  line_total: number; 
  unit_price: number;
  product_name: string;
}

export interface WriteNewOrder {
  customerId: number,
  status: string,
  total: number 
}

export interface CreatedOrder {
    customer_id: number;
    status: string;
    total: number;
    created_at: Date;
    id: number;
}

export interface  WrittenOrderItems {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
}