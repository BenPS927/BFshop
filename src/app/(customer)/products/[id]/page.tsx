'use client';

import ProductDetail from "../../../playground/product-detail";

export default function CustomerProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductDetail params={params} catalogPath="/customer" />;
}
