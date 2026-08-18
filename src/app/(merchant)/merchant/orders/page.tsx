"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CreatedOrder } from "@/app/types/orders";

type ReceivedOrder = Omit<CreatedOrder, "created_at"> & {
  created_at: string;
};

type Board = {
  id: string;
  title: string;
  content: ReactNode;
};

function BoardPanel({ board, lightMode }: { board: Board; lightMode: boolean }) {
  return (
    <article
      className={`flex min-h-[calc(100dvh-11.5rem)] flex-col border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 lg:h-full lg:min-h-0 ${
        lightMode
          ? "border-zinc-300 bg-white text-zinc-950"
          : "border-white/15 bg-white/[0.07] text-white"
      }`}
    >
      <div className="border-b border-current/15 pb-4">
        <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
          {board.title}
        </h2>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto md:mt-6 md:space-y-4">
        {board.content}
      </div>
    </article>
  );
}

export default function MerchantOrdersPage() {
  const [lightMode, setLightMode] = useState(false);
  const [receivedOrders, setReceivedOrders] = useState<ReceivedOrder[]>([]);
  const [sentOrders, setSentOrders] = useState<ReceivedOrder[]>([]);
  const boardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const receivedContent = receivedOrders.map((entry) => (
    <article
      key={entry.id}
      className={`grid gap-3 border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.16)] md:gap-4 md:p-6 ${
        lightMode ? "border-zinc-300 bg-white text-zinc-900" : "border-white/15 bg-white/[0.06] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-inter text-lg font-medium leading-snug md:text-xl ${lightMode ? "text-zinc-900" : "text-white"}`}>
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
        className={`justify-self-start border px-3 py-2 font-inter text-sm font-medium leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
          lightMode
            ? "border-sky-600/50 text-sky-700 hover:border-sky-600 hover:bg-sky-50 hover:text-sky-900"
            : "border-sky-400/50 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10 hover:text-sky-100"
        }`}
      >
        Mark as sent
      </button>
    </article>
  ));

  const sentContent = sentOrders.map((entry) => (
    <article
      key={entry.id}
      className={`grid gap-3 border p-4 shadow-[0_8px_20px_rgba(0,0,0,0.16)] md:gap-4 md:p-6 ${
        lightMode ? "border-zinc-300 bg-white text-zinc-900" : "border-white/15 bg-white/[0.06] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-inter text-lg font-medium leading-snug md:text-xl ${lightMode ? "text-zinc-900" : "text-white"}`}>
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
        className={`justify-self-start border px-3 py-2 font-inter text-sm font-medium leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
          lightMode
            ? "border-sky-600/50 text-sky-700 hover:border-sky-600 hover:bg-sky-50 hover:text-sky-900"
            : "border-sky-400/50 text-sky-300 hover:border-sky-300 hover:bg-sky-400/10 hover:text-sky-100"
        }`}
      >
        Mark as sent
      </button>
    </article>
  ));

  const boards: Board[] = [
    {
      id: "orders",
      title: "Received",
      content: receivedContent,
    },
    {
      id: "inventory",
      title: "Sent",
      content: sentContent,
    },
    {
      id: "operations",
      title: "Delivered",
      content: null,
    },
  ];

  const loadReceivedOrders = async () => {
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
    setReceivedOrders(orders);
  };

  const loadSentOrders = async () => {
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
      setSentOrders(orders);
    } catch (error) {
      console.error("[sent orders] error loading sent orders", error);
    }
  };

  useEffect(() => {
    void loadReceivedOrders();
    void loadSentOrders();
  }, []);

  function scrollToBoard(index: number) {
    boardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function toggleTheme() {
    setLightMode((currentMode) => !currentMode);
  }

  async function markAsSent(orderId: number) {
    const response = await fetch("/api/merchant/markAsSent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    if (response.ok) {
      await loadReceivedOrders();
      await loadSentOrders();
    }
  }

  async function markAsDelivered(orderId: number) {
    const response = await fetch("/api/merchant/markAsDelivered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    if (response.ok) {
      await loadReceivedOrders();
      await loadSentOrders();
    }
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
        <header className="sticky top-0 z-20 flex items-start justify-center bg-transparent backdrop-blur-[1px]">
          <div className="absolute left-0 top-2">
            <Link
              href="/merchant"
              className={`font-inter text-xs font-semibold uppercase tracking-[0.14em] transition ${
                lightMode ? "text-sky-700 hover:text-sky-900" : "text-sky-400 hover:text-sky-300"
              }`}
            >
              BFshop / Merchant
            </Link>
          </div>

          <div className="text-center">
            <h1
              className={`border-b p-2 text-center font-bebas text-4xl leading-tight tracking-[0.12em] md:text-5xl lg:p-8 lg:text-6xl ${
                lightMode ? "border-sky-700" : "border-sky-400"
              }`}
            >
              BF <span className={lightMode ? "text-sky-700" : "text-sky-400"}>Merchant</span>
            </h1>
            <p className={`mt-1 font-inter text-xs font-semibold uppercase tracking-[0.14em] ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
              Order Hub
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`}
            title={`Switch to ${lightMode ? "dark" : "light"} mode`}
            className={`absolute right-0 top-0 grid size-11 shrink-0 place-items-center border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
              lightMode
                ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700"
                : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"
            }`}
          >
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </header>

        <div className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:-mr-6 md:gap-6 lg:mr-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0">
          {boards.map((board, index) => {
            const prevBoard = index > 0 ? boards[index - 1] : null;
            const nextBoard = index < boards.length - 1 ? boards[index + 1] : null;

            return (
              <div key={board.id} className="w-[calc(100vw-2rem)] shrink-0 snap-center lg:w-auto">
                <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-400">
                  {prevBoard ? (
                    <button
                      type="button"
                      onClick={() => scrollToBoard(index - 1)}
                      className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-400/10 px-2 py-1 transition hover:border-sky-300 hover:text-sky-300"
                    >
                      <span aria-hidden="true">←</span>
                      <span>{prevBoard.title === "Sent" ? "Received" : prevBoard.title}</span>
                    </button>
                  ) : (
                    <span className="w-[76px]" aria-hidden="true" />
                  )}

                  {nextBoard ? (
                    <button
                      type="button"
                      onClick={() => scrollToBoard(index + 1)}
                      className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-400/10 px-2 py-1 transition hover:border-sky-300 hover:text-sky-300"
                    >
                      <span>{nextBoard.title === "Received" ? "Sent orders" : nextBoard.title}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  ) : (
                    <span className="w-[76px]" aria-hidden="true" />
                  )}
                </div>

                <div
                  ref={(el) => {
                    boardRefs.current[index] = el;
                  }}
                >
                  <BoardPanel board={board} lightMode={lightMode} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}