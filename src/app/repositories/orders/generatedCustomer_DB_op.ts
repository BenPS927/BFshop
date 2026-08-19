import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";
import type { Customer } from "@/app/types/generateOrder";

export async function generateCustomer_DB_op(tx: Prisma.TransactionClient | PrismaClient, customer: Customer) {
    

    console.log("generateCustomer_DB_ops: Looking up customer");
    
    const checkCustomer = await tx.customer.findUnique({
        where: {
            id: customer.id
        }}
    )

    console.log("CHECKS: Customer lookup result", customer);

    if (!checkCustomer) {    
        const newCustomer =                           
            await tx.customer.create({
                data: {
                id: checkCustomer.id, 
                name: checkCustomer.name, 
                address: checkCustomer.address, 
                age: checkCustomer.age,
                gender: checkCustomer.gender,
            }
        });
        
        const customer = [...checkCustomer, ...newCustomer];

    }
}