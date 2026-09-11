import { prisma } from "@/server/db"

export async function getProductsForAnalysis_DB_op() {
    return prisma.product.findMany({
        select: {
            id: true,
            title: true,
            category: true,
        },
        orderBy: { id: "asc" },
    })
}
