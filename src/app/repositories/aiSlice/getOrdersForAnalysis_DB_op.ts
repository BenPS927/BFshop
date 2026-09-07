import { prisma } from "@/server/db"
import type { Prisma } from "@/generated/prisma/client"

export async function getOrdersForAnalysis_DB_op<
    TQuery extends Prisma.OrderFindManyArgs,
>(query: TQuery): Promise<Prisma.OrderGetPayload<TQuery>[]> {
    return prisma.order.findMany(query) as Promise<
        Prisma.OrderGetPayload<TQuery>[]
    >
}
