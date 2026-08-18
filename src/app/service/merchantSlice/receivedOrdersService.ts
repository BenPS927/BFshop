import { getOrders_DB_op } from "@/app/repositories/merchantSlice/getOrders_DB_op";

export async function receivedOrdersService() {
    console.log("[received orders service] requesting received orders from repository");
    const orders = await getOrders_DB_op();
    const receivedOrders = orders.filter((order) => {
        return order.status === "received";
    });
    return receivedOrders;
}