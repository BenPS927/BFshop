import { generatedOrderService } from '@/app/service/orders/generatedOrderService'
import { GeneratedOrderRequest } from '@/app/types/generateOrderApi'

export async function POST(request: Request) {
    try {

        console.log("API: Request received");

        const order: GeneratedOrderRequest = await request.json();

        console.log("API: Parsed order", order);

        if (!order.orderItems || order.orderItems.length === 0) {
            return Response.json(
                { error: "Order must contain at least one item." },
                { status: 400 }
            );
        }

        console.log("API: Calling createOrderService");

        const createdOrder = await generatedOrderService(order);

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