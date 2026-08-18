import { deliveredOrdersService } from "@/app/service/merchantSlice/deliveredOrdersService"

export async function GET() {
    const deliveredOrders = await deliveredOrdersService()
    return Response.json(deliveredOrders, { status: 200 });
}