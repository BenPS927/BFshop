"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { CreatedOrder } from "@/app/types/orders";
import type { OrderItemDetail } from "@/app/types/getOrderItems";
import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";
import { useMerchantTheme } from "../useMerchantTheme";

type ReceivedOrder = Omit<CreatedOrder, "created_at"> & {
  created_at: string;
};

type OrdersPageResponse = {
  orders: ReceivedOrder[];
  totalCount: number;
  nextCursor: number | null;
};

type LoadOrdersOptions = {
  cursor?: number;
  append?: boolean;
};

type Board = {
  id: string;
  title: string;
  content: ReactNode;
  isLoading: boolean;
  isLoadingMore: boolean;
  count: number;
  nextCursor: number | null;
  onLoadMore: () => void;
};

function BoardPanel({
  board,
  lightMode,
}: {
  board: Board;
  lightMode: boolean;
}) {
  const reduceMotion = useReducedMotion();
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

        <div className="ml-auto flex shrink-0 items-center justify-end gap-3">
          <div className="flex max-w-[58%] flex-wrap justify-end gap-2">
            {mobileNavigation.map((navigationLabel) => (
              <span
                key={navigationLabel}
                className="font-inter text-xs font-semibold uppercase tracking-[0.12em] text-sky-500 md:hidden"
              >
                {navigationLabel}
              </span>
            ))}
          </div>

          <div
            className={`flex min-w-10 items-center justify-center overflow-hidden rounded-lg border px-3 py-2 font-inter text-sm font-semibold tabular-nums md:text-base ${
              lightMode
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : "border-sky-400/25 bg-sky-400/10 text-sky-300"
            }`}
            aria-live="polite"
            aria-label={`${board.count} orders`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={board.count}
                initial={reduceMotion ? false : { opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
              >
                {board.count}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto md:mt-6 md:space-y-4">
        {board.isLoading ? (
          <p className="font-inter text-sm text-zinc-500 dark:text-zinc-400">Loading orders...</p>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {board.content}
            </AnimatePresence>
            {board.nextCursor !== null && (
              <button
                type="button"
                onClick={board.onLoadMore}
                disabled={board.isLoadingMore}
                className={`w-full rounded-md border px-4 py-3 font-inter text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-60 ${
                  lightMode
                    ? "border-sky-600/40 text-sky-700 hover:border-sky-600 hover:bg-sky-50"
                    : "border-sky-400/35 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10"
                }`}
              >
                {board.isLoadingMore ? "Loading…" : "Load 10 more"}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}

type OrderCardProps = {
  entry: ReceivedOrder;
  index: number;
  lightMode: boolean;
  isNew: boolean;
  isMuted?: boolean;
  isDetailsOpen: boolean;
  items: OrderItemDetail[];
  isLoadingItems: boolean;
  itemsError?: string;
  actionLabel: string;
  actionDisabled?: boolean;
  onAction: () => void;
  onViewItems: () => void;
  onCloseItems: () => void;
};

function OrderCard({
  entry,
  index,
  lightMode,
  isNew,
  isMuted = false,
  isDetailsOpen,
  items,
  isLoadingItems,
  itemsError,
  actionLabel,
  actionDisabled = false,
  onAction,
  onViewItems,
  onCloseItems,
}: OrderCardProps) {
  const cardColour = isMuted
    ? lightMode
      ? "border-zinc-300/70 bg-zinc-200 text-zinc-700"
      : "border-white/10 bg-black/35 text-zinc-500"
    : lightMode
      ? "border-zinc-200/70 bg-white text-zinc-900"
      : "border-white/10 bg-white/[0.06] text-white";
  const secondaryText = isMuted
    ? lightMode ? "text-zinc-600" : "text-zinc-600"
    : lightMode ? "text-zinc-600" : "text-zinc-400";
  const buttonColour = lightMode
    ? "border-sky-600/50 text-sky-700 hover:border-sky-600 hover:bg-sky-50 hover:text-sky-900"
    : "border-sky-400/50 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10 hover:text-sky-100";

  return (
    <motion.article
      layoutId={`order-${entry.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.35, delay: index * 0.04 },
        layout: { duration: 0.8, ease: "easeInOut" },
      }}
      className={`min-h-56 overflow-hidden rounded-xl border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.16)] md:p-5 ${cardColour}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDetailsOpen ? (
          <motion.div
            key="items"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-current/15 pb-3">
              <div>
                <p className={`font-inter text-xs font-semibold uppercase tracking-[0.12em] ${secondaryText}`}>Order items</p>
                <h3 className="mt-1 font-inter text-lg font-semibold leading-snug">Order #{entry.id}</h3>
              </div>
              <button
                type="button"
                onClick={onCloseItems}
                aria-label={`Return to order ${entry.id}`}
                title="Back to order"
                className={`grid size-9 place-items-center rounded-full border font-inter text-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${buttonColour}`}
              >
                ←
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {isLoadingItems ? (
                <p className={`py-5 text-center font-inter text-sm ${secondaryText}`}>Loading items…</p>
              ) : itemsError ? (
                <p className="py-5 text-center font-inter text-sm text-rose-400">{itemsError}</p>
              ) : items.length === 0 ? (
                <p className={`py-5 text-center font-inter text-sm ${secondaryText}`}>No order items found.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-md border px-3 py-2 ${lightMode ? "border-zinc-200 bg-zinc-50" : "border-white/10 bg-black/20"}`}>
                    <span className="truncate font-inter text-sm font-medium" title={item.product_name}>{item.product_name}</span>
                    <span className={`font-inter text-xs ${secondaryText}`}>×{item.quantity}</span>
                    <span className="font-inter text-sm font-medium">${Number(item.line_total).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid min-h-48 grid-rows-[auto_1fr_auto] gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-inter font-medium leading-snug transition-[color,font-size,text-shadow] duration-300 ease-out ${isNew ? lightMode ? "text-xl text-sky-700 [text-shadow:0_0_8px_rgba(3,105,161,0.45)] md:text-2xl" : "text-xl text-sky-300 [text-shadow:0_0_8px_rgba(125,211,252,0.55)] md:text-2xl" : "text-lg md:text-xl"}`}>
                Order #{entry.id}
              </h3>
              <span className={`shrink-0 font-inter text-base font-semibold leading-none ${isMuted ? secondaryText : lightMode ? "text-sky-700" : "text-sky-300"}`}>
                ${Number(entry.total).toFixed(2)}
              </span>
            </div>

            <div className={`border-t border-current/15 pt-3 font-inter text-xs leading-normal md:text-sm ${secondaryText}`}>
              <p>Received {new Date(entry.created_at).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={onViewItems} className={`rounded-md border px-3 py-2 font-inter text-xs font-medium leading-tight transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 md:text-sm ${buttonColour}`}>
                View order items
              </button>
              <button type="button" onClick={onAction} disabled={actionDisabled} className={`rounded-md border px-3 py-2 font-inter text-xs font-medium leading-tight transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-default disabled:opacity-60 md:text-sm ${buttonColour}`}>
                {actionLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function MerchantOrdersPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();
  const [receivedOrders, setReceivedOrders] = useState<ReceivedOrder[]>([]);
  const [sentOrders, setSentOrders] = useState<ReceivedOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<ReceivedOrder[]>([]);
  const [receivedTotalCount, setReceivedTotalCount] = useState(0);
  const [sentTotalCount, setSentTotalCount] = useState(0);
  const [deliveredTotalCount, setDeliveredTotalCount] = useState(0);
  const [receivedNextCursor, setReceivedNextCursor] = useState<number | null>(null);
  const [sentNextCursor, setSentNextCursor] = useState<number | null>(null);
  const [deliveredNextCursor, setDeliveredNextCursor] = useState<number | null>(null);
  const [verifiedDeliveredOrderIds, setVerifiedDeliveredOrderIds] = useState<number[]>([]);
  const [newOrderIds, setNewOrderIds] = useState<number[]>([]);
  const [loadingBoards, setLoadingBoards] = useState({
    received: true,
    sent: true,
    delivered: true,
  });
  const [loadingMoreBoards, setLoadingMoreBoards] = useState({
    received: false,
    sent: false,
    delivered: false,
  });
  const loadedOrderIdsByColumn = useRef(new Map<string, Set<number>>());
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [orderItemsByOrderId, setOrderItemsByOrderId] = useState<Record<number, OrderItemDetail[]>>({});
  const [loadingOrderItemsId, setLoadingOrderItemsId] = useState<number | null>(null);
  const [orderItemErrors, setOrderItemErrors] = useState<Record<number, string>>({});
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

  const appendLoadedOrders = (
    currentOrders: ReceivedOrder[],
    additionalOrders: ReceivedOrder[]
  ) => {
    const currentIds = new Set(currentOrders.map((order) => order.id));
    const uniqueAdditionalOrders = additionalOrders.filter(
      (order) => !currentIds.has(order.id)
    );

    return newestFirst([...currentOrders, ...uniqueAdditionalOrders]);
  };

  const receivedContent = receivedOrders.map((entry, index) => (
    <OrderCard
      key={entry.id}
      entry={entry}
      index={index}
      lightMode={lightMode}
      isNew={newOrderIds.includes(entry.id)}
      isDetailsOpen={openOrderId === entry.id}
      items={orderItemsByOrderId[entry.id] ?? []}
      isLoadingItems={loadingOrderItemsId === entry.id}
      itemsError={orderItemErrors[entry.id]}
      actionLabel="Mark as sent"
      onAction={() => markAsSent(entry.id)}
      onViewItems={() => viewOrderItems(entry.id)}
      onCloseItems={() => setOpenOrderId(null)}
    />
  ));

  const sentContent = sentOrders.map((entry, index) => (
    <OrderCard
      key={entry.id}
      entry={entry}
      index={index}
      lightMode={lightMode}
      isNew={newOrderIds.includes(entry.id)}
      isDetailsOpen={openOrderId === entry.id}
      items={orderItemsByOrderId[entry.id] ?? []}
      isLoadingItems={loadingOrderItemsId === entry.id}
      itemsError={orderItemErrors[entry.id]}
      actionLabel="Mark as delivered"
      onAction={() => markAsDelivered(entry.id)}
      onViewItems={() => viewOrderItems(entry.id)}
      onCloseItems={() => setOpenOrderId(null)}
    />
  ));

  const deliveredContent = deliveredOrders.map((entry, index) => {
    const isVerified = verifiedDeliveredOrderIds.includes(entry.id);

    return (
      <OrderCard
        key={entry.id}
        entry={entry}
        index={index}
        lightMode={lightMode}
        isNew={newOrderIds.includes(entry.id)}
        isMuted={isVerified}
        isDetailsOpen={openOrderId === entry.id}
        items={orderItemsByOrderId[entry.id] ?? []}
        isLoadingItems={loadingOrderItemsId === entry.id}
        itemsError={orderItemErrors[entry.id]}
        actionLabel={isVerified ? "Delivery verified" : "Verify delivered"}
        actionDisabled={isVerified}
        onAction={() => verifyDelivered(entry.id)}
        onViewItems={() => viewOrderItems(entry.id)}
        onCloseItems={() => setOpenOrderId(null)}
      />
    );
  });

  const boards: Board[] = [
    {
      id: "orders",
      title: "Received",
      content: receivedContent,
      isLoading: loadingBoards.received,
      isLoadingMore: loadingMoreBoards.received,
      count: receivedTotalCount,
      nextCursor: receivedNextCursor,
      onLoadMore: () => void loadReceivedOrders({ cursor: receivedNextCursor ?? undefined, append: true }),
    },
    {
      id: "inventory",
      title: "Sent",
      content: sentContent,
      isLoading: loadingBoards.sent,
      isLoadingMore: loadingMoreBoards.sent,
      count: sentTotalCount,
      nextCursor: sentNextCursor,
      onLoadMore: () => void loadSentOrders({ cursor: sentNextCursor ?? undefined, append: true }),
    },
    {
      id: "operations",
      title: "Delivered",
      content: deliveredContent,
      isLoading: loadingBoards.delivered,
      isLoadingMore: loadingMoreBoards.delivered,
      count: deliveredTotalCount,
      nextCursor: deliveredNextCursor,
      onLoadMore: () => void loadDeliveredOrders({ cursor: deliveredNextCursor ?? undefined, append: true }),
    },
  ];

  async function loadReceivedOrders({ cursor, append = false }: LoadOrdersOptions = {}) {
    if (append) {
      setLoadingMoreBoards((current) => ({ ...current, received: true }));
    } else {
      setLoadingBoards((current) => ({ ...current, received: true }));
    }

    try {
      console.log("[received orders] requesting /api/merchant/receivedOrders");
      const url = cursor === undefined
        ? "/api/merchant/receivedOrders"
        : `/api/merchant/receivedOrders?cursor=${cursor}`;
      const response = await fetch(url);

      console.log("[received orders] API response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error("Unable to load received orders");
      }

      const result: OrdersPageResponse = await response.json();
      console.log("[received orders] received API payload", {
        loadedCount: result.orders.length,
        totalCount: result.totalCount,
      });

      if (append) {
        setReceivedOrders((current) => appendLoadedOrders(current, result.orders));
      } else {
        applyLoadedOrders("received", result.orders, setReceivedOrders);
      }

      setReceivedTotalCount(result.totalCount);
      setReceivedNextCursor(result.nextCursor);
    } catch (error) {
      console.error("[received orders] error loading received orders", error);
    } finally {
      if (append) {
        setLoadingMoreBoards((current) => ({ ...current, received: false }));
      } else {
        setLoadingBoards((current) => ({ ...current, received: false }));
      }
    }
  }

  async function loadSentOrders({ cursor, append = false }: LoadOrdersOptions = {}) {
    if (append) {
      setLoadingMoreBoards((current) => ({ ...current, sent: true }));
    } else {
      setLoadingBoards((current) => ({ ...current, sent: true }));
    }

    try {
      console.log("[sent orders] requesting /api/merchant/sentOrders");
      const url = cursor === undefined
        ? "/api/merchant/sentOrders"
        : `/api/merchant/sentOrders?cursor=${cursor}`;
      const response = await fetch(url);

      console.log("[sent orders] API response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error("Unable to load sent orders");
      }

      const result: OrdersPageResponse = await response.json();
      console.log("[sent orders] received API payload", {
        loadedCount: result.orders.length,
        totalCount: result.totalCount,
      });

      if (append) {
        setSentOrders((current) => appendLoadedOrders(current, result.orders));
      } else {
        applyLoadedOrders("sent", result.orders, setSentOrders);
      }

      setSentTotalCount(result.totalCount);
      setSentNextCursor(result.nextCursor);
    } catch (error) {
      console.error("[sent orders] error loading sent orders", error);
    } finally {
      if (append) {
        setLoadingMoreBoards((current) => ({ ...current, sent: false }));
      } else {
        setLoadingBoards((current) => ({ ...current, sent: false }));
      }
    }
  }

  async function loadDeliveredOrders({ cursor, append = false }: LoadOrdersOptions = {}) {
    if (append) {
      setLoadingMoreBoards((current) => ({ ...current, delivered: true }));
    } else {
      setLoadingBoards((current) => ({ ...current, delivered: true }));
    }

    try {
      console.log("[delivered orders] requesting /api/merchant/deliveredOrders");
      const url = cursor === undefined
        ? "/api/merchant/deliveredOrders"
        : `/api/merchant/deliveredOrders?cursor=${cursor}`;
      const response = await fetch(url);

      console.log("[delivered orders] API response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error("Unable to load delivered orders");
      }

      const result: OrdersPageResponse = await response.json();
      console.log("[delivered orders] received API payload", {
        loadedCount: result.orders.length,
        totalCount: result.totalCount,
      });

      if (append) {
        setDeliveredOrders((current) => appendLoadedOrders(current, result.orders));
      } else {
        applyLoadedOrders("delivered", result.orders, setDeliveredOrders);
      }

      setDeliveredTotalCount(result.totalCount);
      setDeliveredNextCursor(result.nextCursor);
    } catch (error) {
      console.error("[delivered orders] error loading sent orders", error);
    } finally {
      if (append) {
        setLoadingMoreBoards((current) => ({ ...current, delivered: false }));
      } else {
        setLoadingBoards((current) => ({ ...current, delivered: false }));
      }
    }
  }

  useEffect(() => {
    void loadReceivedOrders();
    void loadSentOrders();
    void loadDeliveredOrders();
  }, []);

  async function viewOrderItems(orderId: number) {
    setOpenOrderId(orderId);

    if (orderItemsByOrderId[orderId]) {
      return;
    }

    setLoadingOrderItemsId(orderId);
    setOrderItemErrors((current) => {
      const next = { ...current };
      delete next[orderId];
      return next;
    });

    try {
      const response = await fetch(`/api/merchant/viewDetails?orderId=${orderId}`);
      const output = await response.json();

      if (!response.ok) {
        throw new Error(output.error ?? "Unable to load order items");
      }

      setOrderItemsByOrderId((current) => ({ ...current, [orderId]: output }));
    } catch (error) {
      setOrderItemErrors((current) => ({
        ...current,
        [orderId]: error instanceof Error ? error.message : "Unable to load order items",
      }));
    } finally {
      setLoadingOrderItemsId((current) => current === orderId ? null : current);
    }
  }

  async function markAsSent(orderId: number) {
    const order = receivedOrders.find((entry) => entry.id === orderId);

    if (!order) {
      return;
    }

    setReceivedOrders((currentOrders) =>
      currentOrders.filter((entry) => entry.id !== orderId)
    );
    setSentOrders((currentOrders) => [
      { ...order, status: "sent" },
      ...currentOrders.filter((entry) => entry.id !== orderId),
    ]);
    setReceivedTotalCount((current) => Math.max(0, current - 1));
    setSentTotalCount((current) => current + 1);
    highlightNewOrder(orderId);

    try {
      const response = await fetch("/api/merchant/markAsSent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
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
    setReceivedTotalCount((current) => current + 1);
    setSentTotalCount((current) => Math.max(0, current - 1));
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
      { ...order, status: "delivered" },
      ...currentOrders.filter((entry) => entry.id !== orderId),
    ]);
    setSentTotalCount((current) => Math.max(0, current - 1));
    setDeliveredTotalCount((current) => current + 1);
    highlightNewOrder(orderId);

    try {
      const response = await fetch("/api/merchant/markAsDelivered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
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
    setSentTotalCount((current) => current + 1);
    setDeliveredTotalCount((current) => Math.max(0, current - 1));
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
      className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${
        lightMode
            ? "bg-[radial-gradient(1050px_560px_at_12%_-8%,rgba(14,165,233,0.18),transparent_58%),radial-gradient(820px_520px_at_92%_38%,rgba(56,189,248,0.08),transparent_64%),linear-gradient(180deg,#F8FAFC_0%,#E6EEF6_100%)] text-zinc-950"
            : "bg-[radial-gradient(960px_560px_at_86%_2%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(780px_480px_at_6%_44%,rgba(255,255,255,0.065),transparent_62%),linear-gradient(180deg,#030506_0%,#080B0D_52%,#111416_100%)] text-white"
      }`}
    >
      <section className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-[1600px] grid-rows-[auto_1fr] gap-12 md:min-h-[calc(100vh-6rem)] md:gap-12 lg:min-h-[calc(100vh-9rem)] lg:gap-18">
        <ProjectPageHeader
          title="Order"
          accentTitle="Hub"
          guideId="order-hub"
          guideMessage="This is where orders placed in the merchant end, or generated regularly by the synthetic economy, go to."
          mobileGuideMessage="View orders from the shop and synthetic economy."
          lightMode={lightMode}
          toggleTheme={toggleTheme}
        />

        <WorkspaceReveal>
          <LayoutGroup>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0">
              {boards.map((board) => (
                <div key={board.id} className="w-[calc(100vw-2rem)] shrink-0 snap-center lg:w-auto">
                  <BoardPanel board={board} lightMode={lightMode} />
                </div>
              ))}
            </div>
          </LayoutGroup>
        </WorkspaceReveal>
      </section>
    </main>
  );
}
