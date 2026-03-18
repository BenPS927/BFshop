import { NextResponse } from 'next/server'
import { prisma } from "@/server/db";

export async function GET(){
    
    try {  
  const products = await prisma.product.findMany({
       select: {
         id: true,
         price: true,
         description: true,
         title: true,
         category: true,
         brand: true, 
         thumbnail: true,
       }
    }
    );

     return NextResponse.json({products})
      } catch (error) {
      console.error('Failed to fetch products:', error)
      return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}