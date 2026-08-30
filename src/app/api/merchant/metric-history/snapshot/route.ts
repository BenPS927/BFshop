import { createDailyMetricSnapshot } from "@/app/service/metricsAndHistory/createDailyMetricSnapshot";
import { timingSafeEqual } from "node:crypto";

type DailyMetricSnapshotRequest = {
  businessDate?: unknown;
};

function isValidBusinessDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

function hasValidAuthorization(request: Request, expectedSecret: string): boolean {
  const authorization = request.headers.get("authorization");
  const bearerPrefix = "Bearer ";

  if (!authorization?.startsWith(bearerPrefix)) {
    return false;
  }

  const suppliedSecret = authorization.slice(bearerPrefix.length);
  const suppliedBuffer = Buffer.from(suppliedSecret);
  const expectedBuffer = Buffer.from(expectedSecret);

  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  try {
    const expectedSecret = process.env.METRIC_SNAPSHOT_SECRET;

    if (!expectedSecret) {
      console.error("[daily metric snapshot API] METRIC_SNAPSHOT_SECRET is not configured");

      return Response.json(
        { error: "Snapshot authentication is not configured" },
        { status: 500 }
      );
    }

    if (!hasValidAuthorization(request, expectedSecret)) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as DailyMetricSnapshotRequest;

    if (!isValidBusinessDate(body.businessDate)) {
      return Response.json(
        { error: "businessDate must be a valid date in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    await createDailyMetricSnapshot(body.businessDate);

    return Response.json(
      {
        success: true,
        businessDate: body.businessDate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[daily metric snapshot API] request failed", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to create daily metric snapshot",
      },
      { status: 500 }
    );
  }
}
