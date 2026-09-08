import { getDevLogPrisma } from "@/server/devLogDb";

export async function getDevelopmentLogs_DB_op() {
  return getDevLogPrisma().dev_log.findMany({
    orderBy: {
      published_at: "desc",
    },
  });
}
