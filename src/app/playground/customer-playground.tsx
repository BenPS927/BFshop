'use client';

import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

type Product = {
  id: string | number;
  name?: string;
  title?: string;
  price?: number;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  thumbnail?: string | null;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  amount: number;
};

const CART_STORAGE_KEY = "selection";
const CART_EVENT = "bfshop-cart-updated";
const EMPTY_CART: CartItem[] = [];
let cartSnapshot: CartItem[] | null = null;

function readCart() {
  if (typeof window === "undefined") return EMPTY_CART;
  if (cartSnapshot) return cartSnapshot;

  try {
    const savedCart = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as CartItem[];
    cartSnapshot = Array.isArray(savedCart) ? savedCart : EMPTY_CART;
  } catch {
    cartSnapshot = EMPTY_CART;
  }

  return cartSnapshot;
}

function subscribeToCart(onStoreChange: () => void) {
  const handleStoreChange = () => {
    cartSnapshot = null;
    onStoreChange();
  };
  window.addEventListener("storage", handleStoreChange);
  window.addEventListener(CART_EVENT, handleStoreChange);
  return () => {
    window.removeEventListener("storage", handleStoreChange);
    window.removeEventListener(CART_EVENT, handleStoreChange);
  };
}

function writeCart(cart: CartItem[]) {
  cartSnapshot = cart;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function useCart() {
  const cartItems = useSyncExternalStore(subscribeToCart, readCart, () => EMPTY_CART);

  function addToCart(product: Product, amount: number) {
    if (amount <= 0) return;
    const newItem: CartItem = {
      id: String(product.id),
      title: product.title ?? product.name ?? "Untitled",
      price: product.price ?? 0,
      thumbnail: product.thumbnail ?? "/bg3.jpg",
      amount,
    };
    const existingItem = readCart().find((item) => item.id === newItem.id);
    const updatedCart = existingItem
      ? readCart().map((item) => item.id === newItem.id ? { ...item, amount: item.amount + amount } : item)
      : [...readCart(), newItem];
    writeCart(updatedCart);
  }

  function changeAmount(id: string, change: number) {
    const updatedCart = readCart().flatMap((item) => {
      if (item.id !== id) return [item];
      const nextAmount = item.amount + change;
      return nextAmount > 0 ? [{ ...item, amount: nextAmount }] : [];
    });
    writeCart(updatedCart);
  }

  function clearCart() {
    writeCart([]);
  }

  return { cartItems, addToCart, changeAmount, clearCart };
}

function CartContents({ onOrderSuccess }: { onOrderSuccess: () => void }) {
  const { cartItems, changeAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);

  async function placeOrder() {
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/products/orders/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 1,
          items: cartItems.map((item) => ({ productId: Number(item.id), quantity: item.amount })),
        }),
      });

      if (!response.ok) throw new Error("Order could not be created");
      clearCart();
      onOrderSuccess();
    } catch {
      window.alert("We could not place that order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-2 text-neutral-900">
      <div className="mb-2 rounded border border-neutral-300 bg-white p-2">
        <p className="font-inter text-xs text-gray-600">Cart total</p>
        <p className="font-inter text-base font-semibold text-neutral-950">{formatPrice(cartTotal)}</p>
      </div>
      {cartItems.length === 0 ? (
        <p className="font-inter text-sm text-gray-500">Cart is empty</p>
      ) : cartItems.map((cartItem) => (
        <div key={cartItem.id} className="w-full rounded border border-neutral-300 bg-white p-2">
          <p className="font-inter text-sm font-semibold text-neutral-900">{cartItem.title}</p>
          <img src={cartItem.thumbnail} alt={cartItem.title} className="h-16 w-full rounded object-cover" />
          <div className="mt-2 flex items-center justify-between">
            <p className="font-inter text-xs text-neutral-800">Qty: {cartItem.amount}</p>
            <div className="flex items-center gap-1">
              <button type="button" aria-label={`Decrease ${cartItem.title} quantity`} className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 hover:bg-neutral-100" onClick={() => changeAmount(cartItem.id, -1)}>-</button>
              <button type="button" aria-label={`Increase ${cartItem.title} quantity`} className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 hover:bg-neutral-100" onClick={() => changeAmount(cartItem.id, 1)}>+</button>
            </div>
          </div>
          <p className="font-inter text-xs text-neutral-800">Unit price: {formatPrice(cartItem.price)}</p>
          <p className="font-inter text-xs font-semibold text-neutral-900">Item total: {formatPrice(cartItem.price * cartItem.amount)}</p>
        </div>
      ))}
      <button type="button" disabled={cartItems.length === 0 || isSubmitting} onClick={placeOrder} className="mt-2 w-full rounded-3xl bg-orange-300 p-2 font-inter text-neutral-950 transition-transform duration-300 ease-in-out hover:cursor-pointer hover:bg-orange-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}

function Cart({ onOrderSuccess }: { onOrderSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCartOpen, setIsDesktopCartOpen] = useState(false);

  return (
    <>
      <div className={`fixed right-0 top-20 z-[100] hidden max-h-[calc(100vh-6rem)] w-80 overflow-hidden border border-neutral-300 bg-neutral-100 text-neutral-900 shadow-lg transition-transform duration-300 lg:flex ${isDesktopCartOpen ? "translate-x-0" : "translate-x-4/5"}`} onMouseEnter={() => setIsDesktopCartOpen(true)} onMouseLeave={() => setIsDesktopCartOpen(false)}>
        <div className="flex w-1/5 items-center justify-center p-4"><ShoppingBasketIcon sx={{ color: "orange", fontSize: 32 }} /></div>
        <div className="flex min-h-0 w-4/5 flex-1 flex-col overflow-y-auto p-4" style={{ direction: "rtl" }}><div style={{ direction: "ltr" }}><CartContents onOrderSuccess={onOrderSuccess} /></div></div>
      </div>
      <div className={`fixed right-0 top-20 z-[100] flex max-h-[calc(100vh-6rem)] w-80 max-w-[90vw] overflow-hidden rounded-md border border-neutral-300 bg-neutral-100 text-neutral-900 shadow-lg transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "translate-x-4/5"}`}>
        <button type="button" aria-label="Toggle shopping cart" className="flex w-1/5 shrink-0 cursor-pointer items-center justify-center p-4" onClick={() => setIsOpen(!isOpen)}><ShoppingBasketIcon sx={{ color: "orange", fontSize: 32 }} /></button>
        <div className="flex min-h-0 w-4/5 flex-1 overflow-y-auto p-4" style={{ direction: "rtl" }}><div className="w-full" style={{ direction: "ltr" }}><CartContents onOrderSuccess={onOrderSuccess} /></div></div>
      </div>
    </>
  );
}

function ProductCard({ product, productBasePath }: { product: Product; productBasePath: string }) {
  return (
    <Link href={`${productBasePath}/${product.id}`} className="block">
      <div className="relative flex h-48 flex-col items-center justify-center transition-transform duration-300 lg:h-64">
        <div className="flex h-2/3 w-2/3 flex-col items-center justify-center text-sm text-neutral-900 md:text-lg lg:text-lg">
          <img src={product.thumbnail ?? "/bg3.jpg"} alt={product.title ?? "Item image"} className="max-h-full max-w-full object-contain" />
          <p>{product.title ?? "Item Name"}</p>
          <p className="font-inter text-neutral-900">{formatPrice(product.price ?? 0)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function CustomerPlayground({ productBasePath = "/playground/products" }: { productBasePath?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.products)) {
          throw new Error(data.error ?? "Products could not be loaded");
        }
        setProducts(data.products);
      } catch {
        setProducts([]);
        setLoadError("Products could not be loaded. Check that the development server is running, then refresh.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  function showOrderSuccess() {
    setNotice("Order successfully placed.");
    window.setTimeout(() => setNotice(""), 3200);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-neutral-100 px-4 py-6 text-neutral-950 md:px-6 md:py-8 lg:px-8 lg:py-12">
      {notice && <div role="status" className="fixed right-4 top-4 z-[200] rounded border border-green-300 bg-green-100 px-4 py-3 font-inter text-sm text-green-900 shadow-lg">{notice}</div>}
      <Link href="/" className="absolute left-4 top-4 font-inter text-sm text-gray-500 transition hover:text-neutral-950">&larr; Back</Link>
      <div className="flex w-full max-w-full flex-col items-center justify-center space-y-16 p-8 lg:p-16">
        <h1 className="border-b border-orange-500 p-2 text-center font-bebas text-4xl leading-tight tracking-wide md:text-5xl lg:p-8 lg:text-6xl">BF <span className="text-[orange]">Customer</span></h1>
        <h2 className="p-2 text-left text-base leading-relaxed text-gray-600 md:text-center md:text-lg lg:p-8">This is BF Customer, the customer end of BFShop. Here, you will be able to place orders which will appear in BF Merchant, which you can get to by going back and to the Merchant interface (when it&apos;s built).</h2>
      </div>
      <Cart onOrderSuccess={showOrderSuccess} />
      <p className="text-2xl font-semibold text-neutral-950">Have a browse!</p>
      {isLoading ? <p className="font-inter text-lg text-gray-500">Products loading...</p> : loadError ? <p role="alert" className="font-inter text-lg text-red-700">{loadError}</p> : products.length === 0 ? <p className="font-inter text-lg text-gray-500">No products available.</p> : <div className="grid w-full max-w-full grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">{products.map((product) => <ProductCard key={product.id} product={product} productBasePath={productBasePath} />)}</div>}
    </main>
  );
}
