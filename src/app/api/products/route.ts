import { NextResponse } from 'next/server'
import { prisma } from "@/server/db";

export async function GET(){
    const products = await prisma.product.findMany({
       select: {
         id: true,
         price: true,
         description: true,
         weight: true,
       }
    }
    );

    return NextResponse.json(products)

}