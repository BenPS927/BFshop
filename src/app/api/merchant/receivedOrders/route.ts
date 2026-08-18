import { receivedOrdersService } from "@/app/service/merchantSlice/receivedOrdersService" 

export async function GET() {
        console.log("[received orders API] GET request received");
        const receivedOrders = await receivedOrdersService()
        console.log("[received orders API] returning response", { count: receivedOrders.length });

        return Response.json(receivedOrders, {status:200 })
    
}