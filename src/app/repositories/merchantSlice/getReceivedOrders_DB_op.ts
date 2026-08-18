import { prisma } from "@/server/db";

export async function getReceivedOrders_DB_op() {
    console.log("[received orders repository] querying orders with received status");
    const receivedOrders = await prisma.order.findMany({
        where: {
            status: 'received'
        }}
    )

    console.log("[received orders repository] query completed", { count: receivedOrders.length });

    return receivedOrders
}