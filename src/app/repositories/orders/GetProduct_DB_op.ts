import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";

export async function GetProduct_DB_op(tx: Prisma.TransactionClient | PrismaClient, productIds: number[]) {
    

    console.log("GetProduct_DB_op: Looking up products", {
        requestedCount: productIds.length,
    });
    
    const products = await tx.product.findMany({    
        where: {                                    
            id: {
                in: productIds,
            },
        },
    });

    if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
}

    console.log("GetProduct_DB_op: Products lookup completed", {
        productCount: products.length,
    });


    return products
}