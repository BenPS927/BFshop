"use client";

import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { WorkspaceReveal } from "@/components/shared/WorkspaceReveal";
import type { DevelopmentLogEntry } from "@/app/service/projectPortal/developmentLogService";
import { useMerchantTheme } from "@/app/(merchant)/merchant/useMerchantTheme";

function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  }).format(new Date(date));
}

export function DevelopmentLogClient({ logs }: { logs: DevelopmentLogEntry[] }) {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${lightMode ? "bg-[radial-gradient(1050px_560px_at_12%_-8%,rgba(14,165,233,0.18),transparent_58%),radial-gradient(820px_520px_at_92%_38%,rgba(56,189,248,0.08),transparent_64%),linear-gradient(180deg,#F8FAFC_0%,#E6EEF6_100%)] text-zinc-950" : "bg-[radial-gradient(960px_560px_at_86%_2%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(780px_480px_at_6%_44%,rgba(255,255,255,0.065),transparent_62%),linear-gradient(180deg,#030506_0%,#080B0D_52%,#111416_100%)] text-white"}`}>
      <div className="mx-auto max-w-[1600px]">
        <ProjectPageHeader
          title="Development"
          accentTitle="Log"
          subtitle="Ongoing records of BFshop's implementation, architectural decisions and evolution."
          mobileSubtitle="Ongoing records of BFshop's development and decisions."
          guideId="development-log"
          guideMessage="This log is populated from the project's development database and records BFshop's progress as it is documented. The newest update appears first."
          mobileGuideMessage="BFshop development updates, with the newest first."
          lightMode={lightMode}
          toggleTheme={toggleTheme}
        />

        <WorkspaceReveal className="mx-auto mt-[60px] max-w-5xl sm:mt-12">
          {logs.length === 0 ? (
            <section className={`rounded-lg border p-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.18)] ${lightMode ? "border-zinc-300 bg-white text-zinc-600" : "border-white/15 bg-white/[0.07] text-zinc-400"}`}>
              <p className="font-inter text-sm md:text-base">No development updates have been published yet.</p>
            </section>
          ) : (
            <section aria-label="Development updates" className="relative space-y-4 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-sky-500/30 md:space-y-6">
              {logs.map((log) => (
                <article key={log.id} className="relative pl-8">
                  <span aria-hidden="true" className={`absolute left-0 top-7 size-[15px] rounded-full border-4 ${lightMode ? "border-slate-100 bg-sky-700" : "border-zinc-950 bg-sky-400"}`} />
                  <div className={`rounded-lg border p-4 shadow-[0_14px_34px_rgba(0,0,0,0.16)] md:p-6 ${lightMode ? "border-zinc-300 bg-white/95 text-zinc-950" : "border-white/15 bg-white/[0.07] text-white"}`}>
                    <p className={`whitespace-pre-wrap font-inter text-sm leading-relaxed md:text-base ${lightMode ? "text-zinc-700" : "text-zinc-300"}`}>{log.content}</p>
                    <time dateTime={log.publishedAt} className={`mt-4 block font-inter text-xs leading-normal md:text-sm ${lightMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      {formatPublishedDate(log.publishedAt)}
                    </time>
                  </div>
                </article>
              ))}
            </section>
          )}
        </WorkspaceReveal>
      </div>
    </main>
  );
}
