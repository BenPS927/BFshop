import { metricAnalysisService } from "@/app/service/metricsAndHistory/metricAnalysisService";
import type { AnalysisRequest } from "@/app/types/slice3MetricsAndHistory/analysisRequest";
import { prisma } from "@/server/db";

const maximumSavedViews = 5;

type StoredSavedView = {
  id: number;
  request: AnalysisRequest;
  created_at: Date;
};

function isAnalysisRequest(value: unknown): value is AnalysisRequest {
  if (!value || typeof value !== "object") return false;

  const request = value as Partial<AnalysisRequest>;
  const hasValidPeriod = request.period === undefined || (
    Array.isArray(request.period.dateRange) &&
    request.period.dateRange.length === 2 &&
    request.period.dateRange.every((date) => typeof date === "string") &&
    (request.period.interval === undefined || ["day", "week", "month"].includes(request.period.interval))
  );

  return (
    Array.isArray(request.metrics) &&
    request.metrics.length === 1 &&
    hasValidPeriod
  );
}

export async function GET() {
  try {
    const savedViews = await prisma.$queryRaw<StoredSavedView[]>`
      SELECT id, request, created_at
      FROM saved_chart
      ORDER BY created_at ASC
      LIMIT ${maximumSavedViews}
    `;

    const hydratedViews = await Promise.all(
      savedViews.map(async (savedView) => ({
        id: savedView.id,
        request: savedView.request,
        result: await metricAnalysisService(savedView.request),
      }))
    );

    return Response.json(hydratedViews);
  } catch (error) {
    console.error("[saved views API] unable to load saved views", error);
    return Response.json({ error: "Unable to load saved views" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { request?: unknown };

    if (!isAnalysisRequest(body.request)) {
      return Response.json({ error: "A valid analysis request is required" }, { status: 400 });
    }

    const countRows = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM saved_chart
    `;

    if (Number(countRows[0]?.count ?? 0) >= maximumSavedViews) {
      return Response.json(
        { error: `A maximum of ${maximumSavedViews} views can be saved` },
        { status: 409 }
      );
    }

    const serializedRequest = JSON.stringify(body.request);
    const inserted = await prisma.$queryRaw<{ id: number }[]>`
      INSERT INTO saved_chart (request)
      VALUES (${serializedRequest}::jsonb)
      RETURNING id
    `;

    return Response.json({ id: inserted[0].id, request: body.request }, { status: 201 });
  } catch (error) {
    console.error("[saved views API] unable to save view", error);
    return Response.json({ error: "Unable to save view" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown };

    if (typeof body.id !== "number" || !Number.isInteger(body.id)) {
      return Response.json({ error: "A valid saved-view ID is required" }, { status: 400 });
    }

    const deleted = await prisma.$executeRaw`
      DELETE FROM saved_chart WHERE id = ${body.id}
    `;

    if (deleted === 0) {
      return Response.json({ error: "Saved view not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[saved views API] unable to delete view", error);
    return Response.json({ error: "Unable to delete view" }, { status: 500 });
  }
}
