import type { Metadata } from "next";
import { developmentLogService } from "@/app/service/projectPortal/developmentLogService";
import { DevelopmentLogClient } from "./DevelopmentLogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Development Log | BFshop Project Portal",
  description: "Ongoing records of BFshop's implementation, architectural decisions and evolution.",
};

export default async function DevelopmentLogPage() {
  const logs = await developmentLogService();

  return <DevelopmentLogClient logs={logs} />;
}
