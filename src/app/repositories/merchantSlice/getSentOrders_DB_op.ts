import { prisma } from "@/server/db";

export async function getSentOrders_DB_op() {
    const sentOrders = await prisma.order.findMany({
        where: {
            status: 'sent',
        }
    });
    return sentOrders
}