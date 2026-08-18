import { markAsDelivered_DB_op } from "@/app/repositories/merchantSlice/markAsDelivered_DB_op";

export async function markAsDeliveredService(orderId: number) {
    const markedAsDelivered = await markAsDelivered_DB_op(orderId);
    return markedAsDelivered;
}