import { getDevelopmentLogs_DB_op } from "@/app/repositories/projectPortal/getDevelopmentLogs_DB_op";

export type DevelopmentLogEntry = {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  lastEditedAt: string | null;
};

export async function developmentLogService(): Promise<DevelopmentLogEntry[]> {
  const logs = await getDevelopmentLogs_DB_op();

  return logs.map((log) => ({
    id: log.id,
    title: log.title,
    content: log.content,
    publishedAt: log.published_at.toISOString(),
    lastEditedAt: log.last_edited_at?.toISOString() ?? null,
  }));
}
