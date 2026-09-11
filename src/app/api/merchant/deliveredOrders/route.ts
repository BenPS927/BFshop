import { deliveredOrdersService } from "@/app/service/merchantSlice/deliveredOrdersService";

export async function GET(request: Request) {
  const cursorValue = new URL(request.url).searchParams.get("cursor");
  const cursor = cursorValue ? Number(cursorValue) : undefined;

  if (cursorValue && (!Number.isInteger(cursor) || cursor! <= 0)) {
    return Response.json(
      { error: "Invalid order cursor" },
      { status: 400 }
    );
  }

  const result = await deliveredOrdersService(cursor);

  return Response.json(result, { status: 200 });
}