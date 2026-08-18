import { markAsSentService } from "@/app/service/merchantSlice/markAsSentService"

export async function POST(request: Request) {

    const { orderId } = await request.json()

    const markedAsSent = await markAsSentService(orderId)

    return Response.json(markedAsSent, {status:200})
}