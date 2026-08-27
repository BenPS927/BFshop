import { Period } from "../../types/analysisMachine";
import type { OrderForAnalysis } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op";

export function filterByDate( orders: OrderForAnalysis[], period: Period): OrderForAnalysis[] {

    // dateRange may arrive as strings (e.g. from a form or JSON body) rather than real Date objects
    const startDate = new Date(period.dateRange[0]);
    const endDate = new Date(period.dateRange[1]);

    const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at);

        return orderDate >= startDate && orderDate <= endDate;
    });

    return filteredOrders;
}