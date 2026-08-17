import { createOrderService } from '@/app/service/orders/createOrderService'
import { CreateOrderRequest } from '@/app/types/orders'

export async function POST(request: Request) {
    try {

        console.log("API: Request received");

        const order: CreateOrderRequest = await request.json();

        console.log("API: Parsed order", order);

        if (!order.items || order.items.length === 0) {
            return Response.json(
                { error: "Order must contain at least one item." },
                { status: 400 }
            );
        }

        console.log("API: Calling createOrderService");

        const createdOrder = await createOrderService(order);

        console.log("API: Service returned", createdOrder);

        return Response.json(createdOrder, { status: 201 });

    } catch (error) {

        console.error("API: Error caught", error);

        if (
            error instanceof Error &&
            (error.message === "Customer not found" ||
             error.message === "Product not found" ||
             error.message === "One or more products not found")
        ) {
            return Response.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return Response.json(
            { error: "Order could not be created." },
            { status: 500 }
        );
    }
}
