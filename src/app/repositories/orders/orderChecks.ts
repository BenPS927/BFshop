import { prisma } from "@/app/lib/prisma";
import { CreateOrderRequest } from '@/app/types/orders'

export async function orderChecks(order: CreateOrderRequest) {
    const customer = await prisma.customer.findUnique({
        where: {
            id: order.customerId,
                },
    });

    const productIds = order.items.map(item => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        }
    });

    return {
        customer,
        products,
    };
}