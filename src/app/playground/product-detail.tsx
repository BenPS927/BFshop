'use client';

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { formatPrice, useCart } from "./customer-playground";

type Product = {
  id: string | number;
  title?: string;
  price?: number;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  thumbnail?: string | null;
};

export default function ProductDetail({ params, catalogPath = "/playground/customer" }: { params: Promise<{ id: string }>; catalogPath?: string }) {
  const { id: productId } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        const foundProduct = Array.isArray(data.products) ? data.products.find((item: Product) => String(item.id) === productId) : null;
        setProduct(foundProduct ?? null);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  function addProduct() {
    if (!product) return;
    addToCart(product, quantity);
    setNotice(`${product.title ?? "Product"} added to cart.`);
    window.setTimeout(() => setNotice(""), 2800);
  }

  return (
    <main className="relative min-h-screen bg-neutral-100 px-4 py-6 text-neutral-950 md:px-6 md:py-8 lg:px-8 lg:py-12">
      {notice && <div role="status" className="fixed right-4 top-4 z-50 rounded border border-green-300 bg-green-100 px-4 py-3 font-inter text-sm text-green-900 shadow-lg">{notice}</div>}
      <Link href={catalogPath} className="font-inter text-sm text-gray-500 transition hover:text-neutral-950">&larr; Back to products</Link>
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center p-8 lg:p-16">
        {isLoading ? <p className="font-inter text-lg text-gray-500">Product loading...</p> : !product ? <div className="text-center"><h1 className="font-bebas text-5xl text-neutral-950">Product not found</h1><Link href={catalogPath} className="mt-4 inline-block font-inter text-sm text-gray-500">Return to products -&gt;</Link></div> : (
          <section className="grid w-full gap-10 md:grid-cols-2 md:items-center">
            <div className="flex min-h-72 items-center justify-center bg-white p-6 shadow-lg"><img src={product.thumbnail ?? "/bg3.jpg"} alt={product.title ?? "Product"} className="max-h-80 max-w-full object-contain" /></div>
            <div className="space-y-5">
              <p className="font-inter text-sm text-gray-500">{product.category ?? "Product"}{product.brand ? ` / ${product.brand}` : ""}</p>
              <h1 className="border-b border-orange-500 pb-3 font-bebas text-5xl leading-tight text-neutral-950 md:text-6xl">{product.title}</h1>
              <p className="font-inter text-2xl text-neutral-950">{formatPrice(product.price ?? 0)}</p>
              <p className="font-inter text-base leading-relaxed text-gray-600">{product.description ?? "A thoughtful addition to your collection."}</p>
              <div className="flex items-end gap-3 pt-4">
                <label className="font-inter text-sm text-gray-600">Quantity<input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} className="mt-1 block w-16 rounded border border-neutral-300 bg-white px-2 py-2 text-neutral-950 shadow-lg" /></label>
                <button type="button" onClick={addProduct} className="rounded-3xl bg-orange-300 px-5 py-3 font-inter text-sm text-neutral-950 transition-transform hover:cursor-pointer hover:bg-orange-400 active:scale-95">Add to cart</button>
              </div>
              <p className="font-inter text-xs text-gray-500">{cartItems.length === 0 ? "Cart is empty" : `${cartItems.length} item${cartItems.length === 1 ? "" : "s"} in cart`}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
