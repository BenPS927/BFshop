import { getSentOrders_DB_op } from  "@/app/repositories/merchantSlice/getSentOrders_DB_op"

export async function sentOrdersService() {
    const sent = await getSentOrders_DB_op() 
    return sent 
}