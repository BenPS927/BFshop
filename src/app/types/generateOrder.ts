export interface FrontendOrder {
    customer: Customer,
    orderItems: FrontendOrderItems[],
}

export interface FrontendOrderItems {
    productId: number;
    quantity: number;
}

export interface Customer {
    id?: number, 
    name: string, 
    address: string, 
    age: number,
    gender: string,
}