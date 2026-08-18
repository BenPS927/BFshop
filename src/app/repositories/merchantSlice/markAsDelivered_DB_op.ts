import { prisma } from "@/server/db"

export async function markAsDelivered_DB_op(orderId: number) {
    const markedAsDelivered = await prisma.order.update({
    
    where: {
            id: orderId, 
        },
        data: {
            status: "sent",
        },
    });
    return markedAsDelivered
}