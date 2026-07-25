import { createOrder } from '@/app/application/orders/createOrder'
import { CreateOrderRequest } from '@/app/types/orders'

export async function POST (request:Request) {
    const order: CreateOrderRequest = await request.json();
    if (!order.items || order.items.length === 0) {
        return Response.json(
            { error: "Order must contain at least one item." },
            { status: 400 }
        )
    }
    const createdOrder = await createOrder(order)

    if (!createdOrder) {
    return Response.json(
        { error: "Order could not be created." },
        { status: 500 }
        );
    }

return Response.json(createdOrder, { status: 201 });
}

