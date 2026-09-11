import { getOrders_DB_op } from "@/app/repositories/merchantSlice/getOrders_DB_op";

export async function receivedOrdersService(cursor?: number) {
  return getOrders_DB_op({
    status: "received",
    cursor,
  });
}