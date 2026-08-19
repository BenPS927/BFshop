import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";
import { WriteNewOrder } from "@/app/types/orders";

export async function WriteOrder_DB_op(tx: Prisma.TransactionClient | PrismaClient, newOrder: WriteNewOrder) {

    console.log("WriteOrder_DB_op: Writing new order", {
        customerId: newOrder.customerId,
        total: newOrder.total,
    });

    const createdOrder = await tx.order.create({
        data: {
            customer_id: newOrder.customerId,
            status:  newOrder.status, 
            total: newOrder.total,
        }
    });

    console.log("WriteOrder_DB_op: Order created", createdOrder.id);
    return createdOrder 

}