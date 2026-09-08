"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";

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
          secondarySubtitle="This section explains how."
        />
      </div>
    </main>
  )
}