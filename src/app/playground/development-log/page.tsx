import type { Metadata } from "next";
import { DevelopmentLogClient } from "./DevelopmentLogClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Development Log | BFshop Project Portal",
  description: "Ongoing records of BFshop's implementation, architectural decisions and evolution.",
};

export default function DevelopmentLogPage() {
  return <DevelopmentLogClient logs={[]} />;
}
