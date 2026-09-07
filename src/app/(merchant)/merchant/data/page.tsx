"use client";

import { IntelligenceInterface } from "@/components/merchant/data/IntelligenceInterface";
import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";
import { useMerchantTheme } from "../useMerchantTheme";

const intelligenceInterfaceSubtitle = "This is the current state of the Intelligence interface. Select a metric, period and filters to explore BFshop's data.";
const intelligenceInterfaceMobileSubtitle = "Explore BFshop data through one configurable chart.";

export default function MerchantDataPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${lightMode ? "bg-[radial-gradient(1050px_560px_at_12%_-8%,rgba(14,165,233,0.18),transparent_58%),radial-gradient(820px_520px_at_92%_38%,rgba(56,189,248,0.08),transparent_64%),linear-gradient(180deg,#F8FAFC_0%,#E6EEF6_100%)] text-zinc-950" : "bg-[radial-gradient(960px_560px_at_86%_2%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(780px_480px_at_6%_44%,rgba(255,255,255,0.065),transparent_62%),linear-gradient(180deg,#030506_0%,#080B0D_52%,#111416_100%)] text-white"}`}>
      <section className="mx-auto max-w-[1600px]">
        <ProjectPageHeader
          title="Intelligence"
          accentTitle="Interface"
          subtitle={intelligenceInterfaceSubtitle}
          mobileSubtitle={intelligenceInterfaceMobileSubtitle}
          guideId="intelligence-interface"
          guideMessage="Use the controls above the chart to choose a metric, date range, interval and customer filters. The chart updates to show the requested view of BFshop's data."
          mobileGuideMessage="Choose a metric, period and filters to update the chart."
          lightMode={lightMode}
          toggleTheme={toggleTheme}
        />

        <WorkspaceReveal className="mt-[60px] sm:mt-12">
          <IntelligenceInterface lightMode={lightMode} workspaceMode />
        </WorkspaceReveal>
      </section>
    </main>
  );
}
