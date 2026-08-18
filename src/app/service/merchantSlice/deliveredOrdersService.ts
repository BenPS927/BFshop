import { getDeliveredOrders_DB_op } from "@/app/repositories/merchantSlice/getDeliveredOrders_DB_op"


export async function deliveredOrdersService() {
    const deliveredOrders = await getDeliveredOrders_DB_op()
    return deliveredOrders 
}