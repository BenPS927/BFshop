import { BackendOrderItem, CreatedOrder } from "@/app/types/orders";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";


export async function WriteOrderItems_DB_op(tx: Prisma.TransactionClient | PrismaClient, orderItems: BackendOrderItem, createdOrder: CreatedOrder) {

    console.log("WriteOrderItems_DB_op: Writing order item", {
        orderId: createdOrder.id,
        productId: orderItems.product_id,
        quantity: orderItems.quantity,
    });

    const writtenOrderItems = await tx.orderItem.create({
        data: {
            product_id: orderItems.product_id,
            quantity: orderItems.quantity,
            line_total: orderItems.line_total,
            unit_price: orderItems.unit_price,
            product_name: orderItems.product_name,
            order_id: createdOrder.id
        }
    });

    console.log("WriteOrderItems_DB_op: Order item created", writtenOrderItems.id);
    return writtenOrderItems

}