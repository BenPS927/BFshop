import type { Prisma } from "@/generated/prisma/client";
import { WriteNewOrder } from "@/app/types/orders";

export async function WriteOrder_DB_op(tx: Prisma.TransactionClient, newOrder: WriteNewOrder) {

    console.log("WriteOrder_DB_ops: Writing new order");

    const createdOrder = await tx.order.create({
        data: {
            customer_id: newOrder.customerId,
            status:  newOrder.status, 
            total: newOrder.total,
        }
    });

    return createdOrder 

}