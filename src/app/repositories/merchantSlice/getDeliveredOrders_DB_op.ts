import { prisma } from "@/server/db"

export async function getDeliveredOrders_DB_op() {
    const deliveredOrders = await prisma.order.findMany({
        where: {
            status: 'delivered',
        }
    });
    return deliveredOrders
}