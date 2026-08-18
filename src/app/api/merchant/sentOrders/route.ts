import { sentOrdersService } from "@/app/service/merchantSlice/sentOrdersService";

export async function GET() {
    console.log("[sent orders API] GET request received");
    const sentOrders = await sentOrdersService();
    console.log("[sent orders API] returning response", { count: sentOrders.length });

    return Response.json(sentOrders, { status: 200 });
}