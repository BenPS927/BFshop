import { getReceivedOrders_DB_op } from "@/app/repositories/merchantSlice/getReceivedOrders_DB_op"

export async function receivedOrdersService() {
    console.log("[received orders service] requesting received orders from repository");
    const received = await getReceivedOrders_DB_op()
    console.log("[received orders service] repository returned orders", { count: received.length });

   return received
}