import { Period } from "../../types/analysisMachine";
import type { OrderForAnalysis } from "../../repositories/aiSlice/getOrdersForAnalysis_DB_op";
import { toBusinessDate } from "../timeSeries/businessDates";

export function filterByDate( orders: OrderForAnalysis[], period: Period): OrderForAnalysis[] {
    const [startDate, endDate] = period.dateRange;

    const filteredOrders = orders.filter((order) => {
        const orderDate = toBusinessDate(new Date(order.created_at));

        return orderDate >= startDate && orderDate <= endDate;
    });

    return filteredOrders;
}
