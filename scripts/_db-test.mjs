import "dotenv/config";
import { prisma } from "../src/server/db.tsx";

try {
  const count = await prisma.customer.count();
  console.log("customer count:", count);
  process.exit(0);
} catch (e) {
  console.error("DB ERROR:", e);
  process.exit(1);
}
