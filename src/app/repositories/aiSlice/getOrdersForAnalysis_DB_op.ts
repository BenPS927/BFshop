import { prisma } from "@/server/db"
import type { Prisma } from "@/generated/prisma/client"

export type OrderForAnalysis = Prisma.OrderGetPayload<{
    include: {
        customer: true
        orderItems: true
    }
}>

export async function getOrdersForAnalysis_DB_op<
    TQuery extends Prisma.OrderFindManyArgs,
>(query: TQuery): Promise<Prisma.OrderGetPayload<TQuery>[]> {
    return prisma.order.findMany(query) as Promise<
        Prisma.OrderGetPayload<TQuery>[]
    >
}
