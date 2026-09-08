import "server-only";

import { PrismaClient } from "@/generated/dev-log-prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForDevLogPrisma = globalThis as unknown as {
  devLogPrisma?: PrismaClient;
};

export function getDevLogPrisma(): PrismaClient {
  if (globalForDevLogPrisma.devLogPrisma) {
    return globalForDevLogPrisma.devLogPrisma;
  }

  const connectionString = process.env.DATABASEURL2;

  if (!connectionString) {
    throw new Error("DATABASEURL2 is not set");
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDevLogPrisma.devLogPrisma = client;
  }

  return client;
}
