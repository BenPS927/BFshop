import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";

export async function GetCustomer_DB_op(tx: Prisma.TransactionClient | PrismaClient, customerId: number) {
    

    console.log("GetCustomer_DB_ops: Looking up customer");
    
    const customer = await tx.customer.findUnique({
        where: {
            id: customerId
        }}
    )

    console.log("CHECKS: Customer lookup result", customer);

    if (!customer) {                               
        throw new Error("Customer not found");
    }


    return customer
}