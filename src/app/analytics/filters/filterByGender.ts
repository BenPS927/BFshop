import type { OrderForAnalysis } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op";

export function filterByGender(orders: OrderForAnalysis[], gender: string): OrderForAnalysis[] {
    return orders.filter((order) => order.customer.gender === gender);
}
