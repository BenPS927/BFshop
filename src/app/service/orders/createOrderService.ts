import { CreateOrderRequest } from "@/app/types/orders";

export async function createOrderService(order: CreateOrderRequest) {
const checks = await orderChecks(order)


}
