import { markAsDeliveredService } from "@/app/service/merchantSlice/markAsDeliveredService"

export async function POST(request: Request) {
    const { orderId } = await request.json()

    const markedAsDelivered = await markAsDeliveredService(orderId)

    return Response.json(markedAsDelivered, {status: 200})
}