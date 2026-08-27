import "dotenv/config";
import dns from "node:dns";
import net from "node:net";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const databaseUrl = new URL(connectionString);
dns.setDefaultResultOrder("ipv4first");
// pg doesn't forward `family` to net.connect, so Happy Eyeballs still races broken IPv6 routes; disable it outright.
net.setDefaultAutoSelectFamily(false);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: databaseUrl.toString(),
  family: 4,
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}