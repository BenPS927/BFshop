import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";

export async function GetCustomer_DB_op(tx: Prisma.TransactionClient | PrismaClient, customerId: number) {
    

    console.log("GetCustomer_DB_op: Looking up customer", customerId);
    
    const customer = await tx.customer.findUnique({
        where: {
            id: customerId
        }}
    )

    console.log("GetCustomer_DB_op: Customer lookup completed", {
        found: customer !== null,
    });
  
    return customer
}