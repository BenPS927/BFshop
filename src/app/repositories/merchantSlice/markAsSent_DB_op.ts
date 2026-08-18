import { prisma } from "@/server/db";

export async function markAsSent_DB_op(orderId: number) {
    const markedAsSent = await prisma.order.update({
        where: {
            id: orderId, 
        },
        data: {
            status: "sent",
        },
    });

    return markedAsSent
}