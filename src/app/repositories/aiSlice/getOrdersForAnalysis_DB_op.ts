import { prisma } from "@/server/db"
import type { Prisma } from "@/generated/prisma/client"

export type OrderForAnalysis = Prisma.OrderGetPayload<{
    include: {
        customer: true;
        orderItems: true;
    };
}>;

export async function getOrdersForAnalysis_DB_op() {

   const orders = await prisma.order.findMany({
    include: {
        customer: true,
        orderItems: true,
    }
});
    return orders;
}