"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, motion } from "framer-motion";
import type { CreatedOrder } from "@/app/types/orders";
import { useMerchantTheme } from "../useMerchantTheme";

type ReceivedOrder = Omit<CreatedOrder, "created_at"> & {
  created_at: string;
};

type Board = {
  id: string;
  title: string;
  content: ReactNode;
  isLoading: boolean;
};

function BoardPanel({ board, lightMode }: { board: Board; lightMode: boolean }) {
  const mobileNavigation =
    board.id === "orders"
      ? ["→ Sent orders"]
      : board.id === "inventory"
        ? ["← Received", "→ Delivered"]
        : ["← Sent"];

  return (
    <article
      className={`flex min-h-[calc(100dvh-11.5rem)] flex-col rounded-lg p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 lg:h-[calc(150dvh-9rem)] lg:min-h-0 ${
        lightMode
          ? "bg-white text-zinc-950"
          : "bg-white/[0.07] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-current/15 pb-4">
        <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
          {board.title}
        </h2>
        <div className="flex max-w-[58%] shrink-0 flex-wrap justify-end gap-2">
          {mobileNavigation.map((navigationLabel) => (
            <span
              key={navigationLabel}
              className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-sky-500 md:hidden"
            >
              {navigationLabel}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto md:mt-6 md:space-y-4">
        {board.isLoading ? (
          <p className="font-inter text-sm text-zinc-500 dark:text-zinc-400">Loading orders...</p>
        ) : (
          board.content
        )}
      </div>
    </article>
  );
}

export default function MerchantOrdersPage() {
  const { lightMode, toggleTheme } = useMerchantTheme();
  const [receivedOrders, setReceivedOrders] = useState<ReceivedOrder[]>([]);
  const [sentOrders, setSentOrders] = useState<ReceivedOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<ReceivedOrder[]>([]);
  const [verifiedDeliveredOrderIds, setVerifiedDeliveredOrderIds] = useState<number[]>([]);
  const [newOrderIds, setNewOrderIds] = useState<number[]>([]);
  const [loadingBoards, setLoadingBoards] = useState({
    received: true,
    sent: true,
    delivered: true,
  });
  const loadedOrderIdsByColumn = useRef(new Map<string, Set<number>>());

  const newestFirst = (orders: ReceivedOrder[]) =>
    [...orders].sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.created_at).getTime() -
        new Date(firstOrder.created_at).getTime()
    );

  const highlightNewOrder = (orderId: number) => {
    setNewOrderIds((currentIds) =>
      currentIds.includes(orderId) ? currentIds : [...currentIds, orderId]
    );

    window.setTimeout(() => {
      setNewOrderIds((currentIds) => currentIds.filter((id) => id !== orderId));
    }, 1500);
  };

  const applyLoadedOrders = (
    columnId: string,
    orders: ReceivedOrder[],
    updateOrders: (orders: ReceivedOrder[]) => void
  ) => {
    const previousOrderIds = loadedOrderIdsByColumn.current.get(columnId);

    if (previousOrderIds) {
      orders.forEach((order) => {
        if (!previousOrderIds.has(order.id)) {
          highlightNewOrder(order.id);
        }
      });
    }

    loadedOrderIdsByColumn.current.set(
      columnId,
      new Set(orders.map((order) => order.id))
    );

    updateOrders(newestFirst(orders));
  };

  const receivedContent = receivedOrders.map((entry) => (
    <motion.article
      key={entry.id}
      layoutId={`order-${entry.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: { duration: 0.35, delay: receivedOrders.indexOf(entry) * 0.04 },
        layout: { duration: 0.8, ease: "easeInOut" },
      }}
      className={`grid gap-3 rounded-md border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.16)] md:gap-4 md:p-6 ${
        lightMode ? "border-zinc-200/70 bg-white text-zinc-900" : "border-white/10 bg-white/[0.06] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-inter font-medium leading-snug transition-[color,font-size,text-shadow] duration-300 ease-out ${
          newOrderIds.includes(entry.id)
            ? lightMode
              ? "text-xl text-sky-700 [text-shadow:0_0_8px_rgba(3,105,161,0.45)] md:text-2xl"
              : "text-xl text-sky-300 [text-shadow:0_0_8px_rgba(125,211,252,0.55)] md:text-2xl"
            : lightMode ? "text-lg text-zinc-900 md:text-xl" : "text-lg text-white md:text-xl"
        }`}>
          Order #{entry.id}
        </h3>
        <span className={`shrink-0 font-inter text-sm font-medium leading-none md:text-base ${lightMode ? "text-sky-700" : "text-sky-300"}`}>
          ${entry.total.toFixed(2)}
        </span>
      </div>

      <div className={`border-t pt-3 font-inter text-xs leading-normal md:pt-4 md:text-sm ${lightMode ? "border-zinc-200 text-zinc-600" : "border-white/15 text-zinc-400"}`}>
        <p>Customer #{entry.customer_id}</p>
        <p className="mt-2">Received {new Date(entry.created_at).toLocaleString()}</p>
      </div>

      <button
        type="button"
        onClick={() => markAsSent(entry.id)}
        className={`justify-self-start rounded-md border px-3 py-2 font-inter text-sm font-medium leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
          lightMode
            ? "border-sky-600/50 text-sky-700 hover:border-sky-600 hover:bg-sky-50 hover:text-sky-900"
            : "border-sky-400/50 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10 hover:text-sky-100"
        }`}
      >
        Mark as sent
      </button>
    </motion.article>
    ));

  const sentContent = sentOrders.map((entry) => (
    <motion.article
      key={entry.id}
      layoutId={`order-${entry.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: { duration: 0.35, delay: sentOrders.indexOf(entry) * 0.04 },
        layout: { duration: 0.8, ease: "easeInOut" },
      }}
      className={`grid gap-3 rounded-md border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.16)] md:p-6 ${
        lightMode ? "border-zinc-200/70 bg-white text-zinc-900" : "border-white/10 bg-white/[0.06] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-inter font-medium leading-snug transition-[color,font-size,text-shadow] duration-300 ease-out ${
          newOrderIds.includes(entry.id)
            ? lightMode
              ? "text-xl text-sky-700 [text-shadow:0_0_8px_rgba(3,105,161,0.45)] md:text-2xl"
              : "text-xl text-sky-300 [text-shadow:0_0_8px_rgba(125,211,252,0.55)] md:text-2xl"
            : lightMode ? "text-lg text-zinc-900 md:text-xl" : "text-lg text-white md:text-xl"
        }`}>
          Order #{entry.id}
        </h3>
        <span className={`shrink-0 font-inter text-sm font-medium leading-none md:text-base ${lightMode ? "text-sky-700" : "text-sky-300"}`}>
          ${entry.total.toFixed(2)}
        </span>
      </div>

      <div className={`border-t pt-3 font-inter text-xs leading-normal md:pt-4 md:text-sm ${lightMode ? "border-zinc-200 text-zinc-600" : "border-white/15 text-zinc-400"}`}>
        <p>Customer #{entry.customer_id}</p>
        <p className="mt-2">Sent {new Date(entry.created_at).toLocaleString()}</p>
      </div>
      <button
        type="button"
        onClick={() => markAsDelivered(entry.id)}
        className={`justify-self-start rounded-md border px-3 py-2 font-inter text-sm font-medium leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
          lightMode
            ? "border-sky-600/50 text-sky-700 hover:border-sky-600 hover:bg-sky-50 hover:text-sky-900"
            : "border-sky-400/50 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10 hover:text-sky-100"
        }`}
      >
        Mark as delivered
      </button>
    </motion.article>
  ));

  const deliveredContent = deliveredOrders.map((entry) => (
    <motion.article
      key={entry.id}
      layoutId={`order-${entry.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: { duration: 0.35, delay: deliveredOrders.indexOf(entry) * 0.04 },
        layout: { duration: 0.8, ease: "easeInOut" },
      }}
      className={`grid gap-3 rounded-md border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.16)] md:p-6 ${
        verifiedDeliveredOrderIds.includes(entry.id)
          ? lightMode
            ? "border-zinc-300/70 bg-zinc-200 text-zinc-700"
            : "border-white/10 bg-black/35 text-zinc-500"
          : lightMode
            ? "border-zinc-200/70 bg-white text-zinc-900"
            : "border-white/10 bg-white/[0.06] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-inter font-medium leading-snug transition-[color,font-size,text-shadow] duration-300 ease-out ${
          newOrderIds.includes(entry.id)
            ? lightMode
              ? "text-xl text-sky-700 [text-shadow:0_0_8px_rgba(3,105,161,0.45)] md:text-2xl"
              : "text-xl text-sky-300 [text-shadow:0_0_8px_rgba(125,211,252,0.55)] md:text-2xl"
            : verifiedDeliveredOrderIds.includes(entry.id)
              ? lightMode ? "text-lg text-zinc-700 md:text-xl" : "text-lg text-zinc-500 md:text-xl"
              : lightMode ? "text-lg text-zinc-900 md:text-xl" : "text-lg text-white md:text-xl"
        }`}>
          Order #{entry.id}
        </h3>
        <span className={`shrink-0 font-inter text-sm font-medium leading-none md:text-base ${
          verifiedDeliveredOrderIds.includes(entry.id)
            ? lightMode ? "text-zinc-700" : "text-zinc-500"
            : lightMode ? "text-sky-700" : "text-sky-300"
        }`}>
          ${entry.total.toFixed(2)}
        </span>
      </div>

      <div className={`border-t pt-3 font-inter text-xs leading-normal md:pt-4 md:text-sm ${
        verifiedDeliveredOrderIds.includes(entry.id)
          ? lightMode ? "border-zinc-300 text-zinc-600" : "border-white/10 text-zinc-600"
          : lightMode ? "border-zinc-200 text-zinc-600" : "border-white/15 text-zinc-400"
      }`}>
        <p>Customer #{entry.customer_id}</p>
        <p className="mt-2">Delivered {new Date(entry.created_at).toLocaleString()}</p>
      </div>

      <button
        type="button"
        onClick={() => verifyDelivered(entry.id)}
        disabled={verifiedDeliveredOrderIds.includes(entry.id)}
        className={`justify-self-start rounded-md border px-3 py-2 font-inter text-sm font-medium leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-default ${
          lightMode
            ? "border-sky-600/50 text-sky-700 hover:border-sky-600 hover:bg-sky-50 hover:text-sky-900"
            : "border-sky-400/50 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10 hover:text-sky-100"
        }`}
      >
        {verifiedDeliveredOrderIds.includes(entry.id) ? "Delivery verified" : "Verify delivered"}
      </button>
      
    </motion.article>
  ));

  const boards: Board[] = [
    {
      id: "orders",
      title: "Received",
      content: receivedContent,
      isLoading: loadingBoards.received,
    },
    {
      id: "inventory",
      title: "Sent",
      content: sentContent,
      isLoading: loadingBoards.sent,
    },
    {
      id: "operations",
      title: "Delivered",
      content: deliveredContent,
      isLoading: loadingBoards.delivered,
    },
  ];

  const loadReceivedOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoadingBoards((current) => ({ ...current, received: true }));
    }

    try {
      console.log("[received orders] requesting /api/merchant/receivedOrders");
      const response = await fetch("/api/merchant/receivedOrders");

      console.log("[received orders] API response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error("Unable to load received orders");
      }

      const orders: ReceivedOrder[] = await response.json();
      console.log("[received orders] received API payload", { count: orders.length });
      applyLoadedOrders("received", orders, setReceivedOrders);
    } catch (error) {
      console.error("[received orders] error loading received orders", error);
    } finally {
      if (showLoading) {
        setLoadingBoards((current) => ({ ...current, received: false }));
      }
    }
  };

  const loadSentOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoadingBoards((current) => ({ ...current, sent: true }));
    }

    try {
      console.log("[sent orders] requesting /api/merchant/sentOrders");
      const response = await fetch("/api/merchant/sentOrders");

      console.log("[sent orders] API response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error("Unable to load sent orders");
      }

      const orders: ReceivedOrder[] = await response.json();
      console.log("[sent orders] received API payload", { count: orders.length });
      applyLoadedOrders("sent", orders, setSentOrders);
    } catch (error) {
      console.error("[sent orders] error loading sent orders", error);
    } finally {
      if (showLoading) {
        setLoadingBoards((current) => ({ ...current, sent: false }));
      }
    }
  };

   const loadDeliveredOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoadingBoards((current) => ({ ...current, delivered: true }));
    }

    try {
      console.log("[delivered orders] requesting /api/merchant/deliveredOrders");
      const response = await fetch("/api/merchant/deliveredOrders");

      console.log("[delivered orders] API response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error("Unable to load delivered orders");
      }

      const orders: ReceivedOrder[] = await response.json();
      console.log("[delivered orders] received API payload", { count: orders.length });
      applyLoadedOrders("delivered", orders, setDeliveredOrders);
    } catch (error) {
      console.error("[delivered orders] error loading sent orders", error);
    } finally {
      if (showLoading) {
        setLoadingBoards((current) => ({ ...current, delivered: false }));
      }
    }
  };

  useEffect(() => {
    void loadReceivedOrders();
    void loadSentOrders();
    void loadDeliveredOrders();
  }, []);

  async function markAsSent(orderId: number) {
    const order = receivedOrders.find((entry) => entry.id === orderId);

    if (!order) {
      return;
    }

    setReceivedOrders((currentOrders) =>
      currentOrders.filter((entry) => entry.id !== orderId)
    );
    setSentOrders((currentOrders) => [
      order,
      ...currentOrders.filter((entry) => entry.id !== orderId),
    ]);
    highlightNewOrder(orderId);

    try {
      const response = await fetch("/api/merchant/markAsSent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        await loadReceivedOrders(false);
        return;
      }
    } catch (error) {
      console.error("[mark as sent] error updating order", error);
    }

    setSentOrders((currentOrders) =>
      currentOrders.filter((entry) => entry.id !== orderId)
    );
    setReceivedOrders((currentOrders) => [
      order,
      ...currentOrders.filter((entry) => entry.id !== orderId),
    ]);
  }

  async function markAsDelivered(orderId: number) {
    const order = sentOrders.find((entry) => entry.id === orderId);

    if (!order) {
      return;
    }

    setSentOrders((currentOrders) =>
      currentOrders.filter((entry) => entry.id !== orderId)
    );
    setDeliveredOrders((currentOrders) => [
      order,
      ...currentOrders.filter((entry) => entry.id !== orderId),
    ]);
    highlightNewOrder(orderId);

    try {
      const response = await fetch("/api/merchant/markAsDelivered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        await loadReceivedOrders(false);
        await loadSentOrders(false);
        return;
      }
    } catch (error) {
      console.error("[mark as delivered] error updating order", error);
    }

    setDeliveredOrders((currentOrders) =>
      currentOrders.filter((entry) => entry.id !== orderId)
    );
    setSentOrders((currentOrders) => [
      order,
      ...currentOrders.filter((entry) => entry.id !== orderId),
    ]);
  }

  function verifyDelivered(orderId: number) {
    setVerifiedDeliveredOrderIds((verifiedOrderIds) =>
      verifiedOrderIds.includes(orderId)
        ? verifiedOrderIds
        : [...verifiedOrderIds, orderId]
    );
  }

  return (
    <main
      className={`min-h-screen px-4 py-6 transition-colors md:px-6 md:py-8 lg:px-8 lg:py-12 ${
        lightMode
          ? "bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(14,165,233,0.12),transparent_60%),linear-gradient(180deg,#F8FAFC_0%,#EAF1F7_100%)] text-zinc-950"
          : "bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#050505_0%,#0A0A0A_45%,#121212_100%)] text-white"
      }`}
    >
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1600px] grid-rows-[auto_1fr] gap-6 md:min-h-[calc(100vh-4rem)] md:gap-8 lg:min-h-[calc(100vh-6rem)] lg:gap-12">
        <header className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
          <div className="pt-2">
            <Link
              href="/merchant"
              className={`font-inter text-xs font-semibold uppercase tracking-[0.14em] transition ${
                lightMode ? "text-sky-700 hover:text-sky-900" : "text-sky-400 hover:text-sky-300"
              }`}
            >
              BFshop / Merchant
            </Link>
          </div>

          <h1
            className={`border-b p-2 text-center font-bebas text-4xl leading-tight tracking-[0.12em] md:text-5xl lg:p-8 lg:text-6xl ${
              lightMode ? "border-sky-700" : "border-sky-400"
            }`}
          >
            Order Hub
          </h1>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`}
            title={`Switch to ${lightMode ? "dark" : "light"} mode`}
            className={`justify-self-end grid size-11 shrink-0 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
              lightMode
                ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700"
                : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"
            }`}
          >
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </header>

        <LayoutGroup>
          <div className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:-mr-6 md:gap-6 lg:mr-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0">
            {boards.map((board, boardIndex) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.45,
                  delay: boardIndex * 0.08,
                  ease: "easeOut",
                }}
                className="w-[calc(100vw-2rem)] shrink-0 snap-center lg:w-auto"
              >
                <BoardPanel board={board} lightMode={lightMode} />
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </section>
    </main>
  );
}