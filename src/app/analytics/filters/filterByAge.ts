import type { OrderForAnalysis } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op";

export function filterByAge(orders: OrderForAnalysis[], ageRange: [number, number]): OrderForAnalysis[] {
    const [min, max] = ageRange;

    return orders.filter((order) => order.customer.age >= min && order.customer.age <= max);
}
