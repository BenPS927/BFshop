import { markAsSent_DB_op } from  "@/app/repositories/merchantSlice/markAsSent_DB_op"


export async function markAsSentService(orderId: number) {
    const markedAsSent = await markAsSent_DB_op(orderId)

    return markedAsSent 
}