import ProductDetail from "../../product-detail";

export default function PlaygroundProductRoute({ params }: { params: Promise<{ id: string }> }) {
  return <ProductDetail params={params} />;
}
