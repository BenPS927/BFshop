import type { Prisma } from "@/generated/prisma/client";

export async function GetProduct_DB_op(tx: Prisma.TransactionClient, productIds: number[]) {
    

    console.log("Getproduct_DB_ops: Looking up products");
    
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

    console.log("CHECKS: product lookup result", products);


    return products
}