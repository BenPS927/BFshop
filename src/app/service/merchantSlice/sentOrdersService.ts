import { getOrders_DB_op } from "@/app/repositories/merchantSlice/getOrders_DB_op";

export async function sentOrdersService() {
    const orders = await getOrders_DB_op() 
    const sent = orders.filter((order: any) => {
        return order.status === "sent";
    });
    return sent 
}