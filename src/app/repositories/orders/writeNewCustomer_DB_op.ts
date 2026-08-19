import type { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";
import { Customer } from "@/app/types/generateOrder";

export async function writeNewCustomer_DB_op(tx: Prisma.TransactionClient | PrismaClient, customer: Customer) {

    console.log("writeNewCustomer_DB_op: Creating new customer");

    const createdCustomer = await tx.customer.create({
        data: {
            name: customer.name, 
            email: customer.email,
            address: customer.address, 
            age: customer.age,
            gender: customer.gender,
        }
    });

    console.log("writeNewCustomer_DB_op: Customer created", createdCustomer.id);
    return createdCustomer

};