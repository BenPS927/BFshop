import { prisma } from "@/server/db"

export async function getOrders_DB_op() {

    const orders = await prisma.order.findMany();

    return orders
}
    