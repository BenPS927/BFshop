import { analysisMachine } from "@/app/service/metricsAndHistory/analysisMachine";
import type { AnalysisRequest } from "@/app/types/analysisMachine";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalysisRequest;
    const result = await analysisMachine(body);

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("[analysis API] request failed", error);

    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to run analysis" },
      { status: 400 }
    );
  }
}