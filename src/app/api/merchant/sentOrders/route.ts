import { sentOrdersService } from "@/app/service/merchantSlice/sentOrdersService"

export async function GET(response: Response) {
    const sentOrders = await sentOrdersService()
    return Response.json(sentOrders, {status:200})
}