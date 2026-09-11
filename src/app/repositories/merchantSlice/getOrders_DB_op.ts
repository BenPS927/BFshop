import { prisma } from "@/server/db";

type OrderStatus = "received" | "sent" | "delivered";

type GetOrdersPageArguments = {
  status: OrderStatus;
  cursor?: number;
  limit?: number;
};

export async function getOrders_DB_op({
  status,
  cursor,
  limit = 10,
}: GetOrdersPageArguments) {
  const [results, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      where: {
        status,
        ...(cursor !== undefined
          ? {
              id: {
                lt: cursor,
              },
            }
          : {}),
      },
      orderBy: {
        id: "desc",
      },
      take: limit + 1,
    }),

    prisma.order.count({
      where: {
        status,
      },
    }),
  ]);

  const hasMore = results.length > limit;
  const orders = results.slice(0, limit);

  return {
    orders,
    totalCount,
    nextCursor: hasMore
      ? orders[orders.length - 1]?.id ?? null
      : null,
  };
}