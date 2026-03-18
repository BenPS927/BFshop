import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight?: number;
  dimensions?: unknown;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: unknown;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: unknown;
  barcode?: string;
  qrCode?: string;
  images: string[];
  thumbnail?: string;
};

async function main() {
  const sourceUrl =
    process.env.PRODUCTS_SOURCE_URL ?? "https://dummyjson.com/products?limit=20";

  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const payload = await res.json();
  const products: DummyProduct[] = payload.products ?? payload;

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        tags: p.tags ?? [],
        brand: p.brand ?? undefined,
        sku: p.sku,
        weight: p.weight ?? undefined,
        dimensions: p.dimensions ?? undefined,
        warrantyInformation: p.warrantyInformation ?? undefined,
        shippingInformation: p.shippingInformation ?? undefined,
        availabilityStatus: p.availabilityStatus ?? undefined,
        reviews: p.reviews ?? undefined,
        returnPolicy: p.returnPolicy ?? undefined,
        minimumOrderQuantity: p.minimumOrderQuantity ?? undefined,
        meta: p.meta ?? undefined,
        barcode: p.barcode ?? undefined,
        qrCode: p.qrCode ?? undefined,
        images: p.images ?? [],
        thumbnail: p.thumbnail ?? undefined,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        tags: p.tags ?? [],
        brand: p.brand ?? undefined,
        sku: p.sku,
        weight: p.weight ?? undefined,
        dimensions: p.dimensions ?? undefined,
        warrantyInformation: p.warrantyInformation ?? undefined,
        shippingInformation: p.shippingInformation ?? undefined,
        availabilityStatus: p.availabilityStatus ?? undefined,
        reviews: p.reviews ?? undefined,
        returnPolicy: p.returnPolicy ?? undefined,
        minimumOrderQuantity: p.minimumOrderQuantity ?? undefined,
        meta: p.meta ?? undefined,
        barcode: p.barcode ?? undefined,
        qrCode: p.qrCode ?? undefined,
        images: p.images ?? [],
        thumbnail: p.thumbnail ?? undefined,
      },
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });