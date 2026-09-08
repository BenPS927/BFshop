import { prisma } from "@/server/db";
import type { OrderItemsResult } from "@/app/types/getOrderItems";

export async function getOrderItems_DB_op(orderId: string): Promise<OrderItemsResult> {
  const rows = await prisma.orderItem.findMany({
    where: {
      order_id: Number(orderId),
    },
    select: {
      product_name: true,
      quantity: true,
      line_total: true,
    },
  });

  return rows.map((row) => ({
    product_name: row.product_name,
    quantity: row.quantity,
    line_total: row.line_total,
  }));
}