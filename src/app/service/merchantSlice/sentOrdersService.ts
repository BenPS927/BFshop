import { getOrders_DB_op } from "@/app/repositories/merchantSlice/getOrders_DB_op";

export async function sentOrdersService(cursor?: number) {
  return getOrders_DB_op({
    status: "sent",
    cursor,
  });
}