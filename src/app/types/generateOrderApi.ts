export interface GeneratedOrderRequest {
    customer: CustomerInput,
    orderItems: OrderItemsRequest[],
}

export interface OrderItemsRequest {
    productId: number;
    quantity: number;
}

export interface CustomerInput { 
    name: string, 
    address: string, 
    age: number,
    gender: string,
}