import { createOrderService } from '@/app/service/orders/createOrderService'
import { CreateOrderRequest } from '@/app/types/orders'

export async function createOrder(order: CreateOrderRequest) {
    return  createOrderService(order)
}