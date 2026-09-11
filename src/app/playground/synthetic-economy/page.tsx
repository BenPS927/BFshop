"use client";

import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";

type EntityBubbleProps = {
  title: string;
  lightMode: boolean;
  compact?: boolean;
  tall?: boolean;
  description?: string;
  details?: string;
};

function EntityBubble({ title, lightMode, compact = false, tall = false, description, details }: EntityBubbleProps) {
  return (
    <div
      className={`relative z-10 flex flex-col items-center justify-center rounded-[2rem] border text-center ${compact ? "min-h-[112px] p-4" : tall ? "min-h-[390px] p-4 md:p-6" : "min-h-[150px] p-4 md:p-6"} ${
        lightMode
          ? "border-sky-200/80 bg-white/75 shadow-[0_18px_55px_rgba(14,165,233,0.08)]"
          : "border-white/10 bg-white/[0.045] shadow-[0_18px_55px_rgba(0,0,0,0.22)]"
      }`}
    >
      <h3 className={`font-inter font-medium leading-snug ${compact ? "text-base md:text-lg" : "text-lg md:text-xl"}`}>{title}</h3>
      {description && (
        <p className={`mt-2 font-inter text-sm leading-relaxed md:text-base ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
          {description}
        </p>
      )}
      {details && (
        <p className={`mt-3 border-t pt-3 font-inter text-xs leading-relaxed md:text-sm ${lightMode ? "border-sky-200 text-zinc-600" : "border-white/15 text-zinc-400"}`}>
          {details}
        </p>
      )}
    </div>
  );
}

export default function SyntheticEconomyPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${lightMode ? "bg-[radial-gradient(1050px_560px_at_12%_-8%,rgba(14,165,233,0.18),transparent_58%),radial-gradient(820px_520px_at_92%_38%,rgba(56,189,248,0.08),transparent_64%),linear-gradient(180deg,#F8FAFC_0%,#E6EEF6_100%)] text-zinc-950" : "bg-[radial-gradient(960px_560px_at_86%_2%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(780px_480px_at_6%_44%,rgba(255,255,255,0.065),transparent_62%),linear-gradient(180deg,#030506_0%,#080B0D_52%,#111416_100%)] text-white"}`}>
      <div className="mx-auto max-w-[1600px]">
        <ProjectPageHeader
          title="Synthetic"
          accentTitle="Economy"
          lightMode={lightMode}
          toggleTheme={toggleTheme}
          subtitle="BFshop uses a synthetic economy to keep data going through the system, which is what is retrieved wby the query machines."
          mobileSubtitle="BFshop uses a synthetic economy to keep data going through the system, which is what is retrieved wby the query machines."
          secondarySubtitle="The top three bubbles represent each an n8n workflow. "
        />

        <WorkspaceReveal className="py-9 md:py-12 lg:py-18">
          <section
            className={`overflow-hidden rounded-3xl p-4 md:p-6 ${
              lightMode
                ? "bg-slate-50/70"
                : "bg-black/20"
            }`}
            aria-label="Synthetic economy flow"
          >
            <div className="relative hidden min-h-[920px] lg:block">
              <svg
                className={`pointer-events-none absolute inset-0 h-full w-full ${lightMode ? "text-sky-500" : "text-sky-300"}`}
                viewBox="0 0 1200 920"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker id="economy-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
                  </marker>
                </defs>
                <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.72" markerEnd="url(#economy-arrow)">
                  <path d="M174 406 C235 565 360 690 500 754" />
                  <path d="M600 406 L600 470" />
                  <path d="M930 406 C875 465 810 515 720 526" />
                  <path d="M1060 406 C990 565 875 675 748 754" />
                </g>
              </svg>

              <div className="absolute left-[2%] top-4 w-[25%]">
                <EntityBubble title="Customers generated" lightMode={lightMode} tall description="The first workflow creates customers and adds them to the database." details="Customers are created with the traits buy-eagerness and spend-eagerness, as well as different ages, genders, and in different neighbourhoods."/>
                
              </div>
              <div className="absolute left-1/2 top-4 w-[25%] -translate-x-1/2">
                <EntityBubble title="Orders created" lightMode={lightMode} tall description="This workflow takes a customer from the database, creates (or doesn't) an order for them, and then stores it in the data table." details="First a customer is selected from the database. Then, an order is created for that customer. This is influenced by their properties. Those in higher value neighbourhoods have a higher spend-eagnerness, meaning they spend more per order. Men and women prefer different products. As do different age groups. Orders are not guaranteed to be created; buy-eagerness interacts with probability code and the real result is an order is placed every 10 to 20 minutes. Orders are stored in the data table."/>
              </div>
              <div className="absolute right-[2%] top-4 w-[25%]">
                <EntityBubble title="Orders placed" lightMode={lightMode} tall description="This workflow takes the orders from the data table, places them with BFshop's backend API, and clears the data table." />
              </div>
              <div className="absolute left-1/2 top-[470px] w-[20%] -translate-x-1/2">
                <EntityBubble title="Orders stored" lightMode={lightMode} compact />
              </div>
              <div className="absolute bottom-4 left-1/2 w-[28%] -translate-x-1/2">
                <EntityBubble title="Database" lightMode={lightMode} description="The database used by BFshop. Orders and customers generated here are added just as if I created them, or you placed one in the customer end." />
              </div>
            </div>

            <div className="space-y-3 lg:hidden">
              <EntityBubble title="Customers generated" lightMode={lightMode} />
              <p className={`text-center font-inter text-xs uppercase tracking-[0.14em] ${lightMode ? "text-sky-700" : "text-sky-300"}`} aria-hidden="true">↓ saved to database</p>
              <EntityBubble title="Database" lightMode={lightMode} compact />

              <div className="py-3" />
              <EntityBubble title="Orders created" lightMode={lightMode} />
              <p className={`text-center text-xl ${lightMode ? "text-sky-600" : "text-sky-300"}`} aria-hidden="true">↓</p>
              <div className="mx-auto max-w-[80%]">
                <EntityBubble title="Orders stored" lightMode={lightMode} compact />
              </div>
              <p className={`text-center text-xl ${lightMode ? "text-sky-600" : "text-sky-300"}`} aria-hidden="true">↑</p>
              <EntityBubble title="Orders placed" lightMode={lightMode} />
              <p className={`text-center font-inter text-xs uppercase tracking-[0.14em] ${lightMode ? "text-sky-700" : "text-sky-300"}`}>
                ↓ returned to the database
              </p>
            </div>
          </section>
        </WorkspaceReveal>
      </div>
    </main>
  )
}
