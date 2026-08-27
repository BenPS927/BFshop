import type { OrderForAnalysis } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op";

export function filterByLocation(orders: OrderForAnalysis[], location: string): OrderForAnalysis[] {
    return orders.filter((order) => order.customer.address.includes(location));
}
