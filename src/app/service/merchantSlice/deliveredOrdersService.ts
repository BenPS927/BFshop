import { getOrders_DB_op } from "@/app/repositories/merchantSlice/getOrders_DB_op";

export async function deliveredOrdersService() {
    const orders = await getOrders_DB_op();
    const deliveredOrders = orders.filter((order) => {
        return order.status === "delivered";
    });

    return deliveredOrders;
}