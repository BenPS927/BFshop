
"use client";

import Link from "next/link";
import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";
import { useMerchantTheme } from "./useMerchantTheme";

const boards = [
  {
    id: "orders",
    href: "/merchant/orders",
    title: "Order Hub",
    description: "Manage orders as received, sent or delivered.",
  },
  {
    id: "inventory",
    href: "/merchant/data",
    title: "Intelligence interface",
    description: "Run analysis requests against your order data and inspect the output.",
  },
  {
    id: "operations",
    title: "",
    description: "",
  },
];

type Board = (typeof boards)[number];

function BoardPanel({ board, lightMode }: { board: Board; lightMode: boolean }) {
  const mobileNavigation =
    board.id === "orders"
      ? ["→ Data"]
      : board.id === "inventory"
        ? ["← Order Hub", "→ Overwatch"]
        : [];

  const panelClassName = `flex min-h-[calc(100dvh-11.5rem)] flex-col rounded-lg border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:p-6 lg:h-full lg:min-h-0 ${
        lightMode
          ? "border-zinc-300 bg-white text-zinc-950"
          : "border-white/15 bg-white/[0.07] text-white"
      }`;

  const panelContent = (
    <>
      {board.id !== "operations" && (
        <div className="flex items-start justify-between gap-4 border-b border-current/15 pb-4">
          <div>
            <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">
              {board.title}
            </h2>
          </div>
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
      )}

      {board.id !== "operations" && (
        <div className="flex flex-1 flex-col justify-center py-6">
          <div
            className={`rounded-md border border-dashed p-4 md:p-6 ${
              lightMode ? "border-zinc-300 bg-zinc-50" : "border-white/15 bg-black/10"
            }`}
          >
            <p
              className={`font-inter text-base leading-relaxed md:text-lg ${
                lightMode ? "text-zinc-700" : "text-zinc-300"
              }`}
            >
              {board.description}
            </p>
          </div>
        </div>
      )}
    </>
  );

  if (typeof board.href === "string") {
    return (
      <Link
        href={board.href}
        className={`${panelClassName} transition hover:border-sky-400/60 hover:shadow-[0_20px_48px_rgba(14,165,233,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`}
      >
        {panelContent}
      </Link>
    );
  }

  return <article className={panelClassName}>{panelContent}</article>;
}

export default function MerchantPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();

  return (
    <main
      className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${
        lightMode
          ? "bg-[radial-gradient(1000px_500px_at_15%_-10%,rgba(14,165,233,0.12),transparent_60%),linear-gradient(180deg,#F8FAFC_0%,#EAF1F7_100%)] text-zinc-950"
          : "bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#050505_0%,#0A0A0A_45%,#121212_100%)] text-white"
      }`}
    >
      <section className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-[1600px] grid-rows-[auto_1fr] gap-12 md:min-h-[calc(100vh-6rem)] md:gap-12 lg:min-h-[calc(100vh-9rem)] lg:gap-18">
        <ProjectPageHeader
          title="BF"
          accentTitle="Merchant"
          guideId="merchant-home"
          guideMessage="This is the main hub for a merchant operating BFshop. Go to Order Hub to view and manage orders, or go to Intelligence to see the current state of the intelligence interface."
          mobileGuideMessage="Manage orders in Order Hub or explore business data in Intelligence."
          lightMode={lightMode}
          toggleTheme={toggleTheme}
        />

        <WorkspaceReveal>
          <div className="min-w-0 md:mt-0">
            <div className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:-mr-6 md:gap-6 lg:mr-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0">
              {boards.map((board) => (
                <div key={board.id} className="w-[calc(100vw-2rem)] shrink-0 snap-center lg:w-auto">
                  <BoardPanel board={board} lightMode={lightMode} />
                </div>
              ))}
            </div>
          </div>
        </WorkspaceReveal>
      </section>
    </main>
  );
}
