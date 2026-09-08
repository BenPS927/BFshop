import { getOrderItems_DB_op } from "@/app/repositories/merchantSlice/getOrderitems_DB_op";

export async function GET(request: Request) {
  try {
    const orderId = Number(new URL(request.url).searchParams.get("orderId"));

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return Response.json({ error: "A valid order ID is required" }, { status: 400 });
    }

    const items = await getOrderItems_DB_op(orderId);

    return Response.json(items);
  } catch (error) {
    console.error("[order items API] unable to load order items", error);
    return Response.json({ error: "Unable to load order items" }, { status: 500 });
  }
}
