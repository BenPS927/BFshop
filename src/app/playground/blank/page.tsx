"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProjectPageHeader } from "@/components/shared/ProjectPageHeader";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";
import { IntelligenceInterface } from "@/components/merchant/data/IntelligenceInterface";

const portalAreas = [
  {
    title: "Analysis machine",
    href: "",
    size: "main",
  },
  {
    title: "Project notes",
    description: "See the thinking, experiments, and unfinished edges behind BFshop.",
    href: "/playground",
    size: "small",
  },
  {
    title: "Project Introduction",
    description: "Read to understand the project's vision and architecture.",
    href: "/playground/introduction",
    size: "small",
  },
] as const;

function OneTimeReveal({
  children,
  trigger,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  trigger: "load" | "scroll";
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    if (trigger === "load") {
      let timeout: number | undefined;
      const frame = window.requestAnimationFrame(() => {
        timeout = window.setTimeout(() => setVisible(true), delay);
      });
      return () => {
        window.cancelAnimationFrame(frame);
        if (timeout !== undefined) window.clearTimeout(timeout);
      };
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, trigger]);

  return (
    <div
      ref={elementRef}
      className={`${className} transition-[opacity,transform] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${trigger === "load" ? "duration-700 ease-in-out" : "duration-500 ease-in-out"} ${visible ? "translate-y-0 opacity-100" : trigger === "load" ? "translate-y-4 opacity-0" : "translate-y-2 opacity-0"}`}
    >
      {children}
    </div>
  );
}

export default function BlankPlaygroundPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-9 md:px-6 md:py-12 lg:px-8 lg:py-18 ${themeReady ? "opacity-100" : "opacity-0"} ${lightMode ? "bg-[radial-gradient(1050px_560px_at_12%_-8%,rgba(14,165,233,0.18),transparent_58%),radial-gradient(820px_520px_at_92%_38%,rgba(56,189,248,0.08),transparent_64%),linear-gradient(180deg,#F8FAFC_0%,#E6EEF6_100%)] text-zinc-950" : "bg-[radial-gradient(960px_560px_at_86%_2%,rgba(14,165,233,0.18),transparent_60%),radial-gradient(780px_480px_at_6%_44%,rgba(255,255,255,0.065),transparent_62%),linear-gradient(180deg,#030506_0%,#080B0D_52%,#111416_100%)] text-white"}`}>
      <div className="mx-auto max-w-[1600px]">
        <ProjectPageHeader
          title="BF"
          accentTitle="shop"
          lightMode={lightMode}
          toggleTheme={toggleTheme}
          guideId="project-portal"
          guideMessage="This is the project portal. Here you can use the current version of the intelligence interface to query the database, read up on the documentation, or navigate to the merchant or customer ends. Use the nav bar at the top left to navigate the project."
          mobileGuideMessage="Use the interface, read the docs, or visit the shop. Use the top-left nav to move around."
          subtitle="BFshop is an experimental project aimed at simplifying eCommerce analytics by replacing traditional chart heavy dashboards with a chat based workspace"
          mobileSubtitle="BFshop is an experimental project aimed at simplifying eCommerce analytics by replacing traditional chart heavy dashboards with a chat based workspace."
          secondarySubtitle="Beneath is a copy of the main interface of BFshop, which will be continually updated as the project progresses."
          mobileSecondarySubtitle="This is the project portal, where you can use the Intelligence interface or read the documentation below."
        />

        <OneTimeReveal trigger="load" delay={150}>
          <div className={`mx-auto mt-[60px] max-w-6xl text-center font-inter text-sm leading-relaxed sm:mt-12 md:mt-[60px] md:text-base ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
            <span className="sm:hidden">Query the data and see the results. This interface will evolve over time.</span>
            <span className="hidden sm:inline">The second iteration of BFshop&apos;s intelligence interface. Select a metric, period and filters to produce a chart directly from the database. This is another step in the evolution towards an AI workspace for investigating the simulated business.</span>
          </div>
        </OneTimeReveal>

        <section className="mt-12 grid gap-28 md:mt-[60px] md:grid-cols-2 md:gap-32 lg:mt-24 lg:grid-cols-[296px_minmax(0,1fr)_296px] lg:items-stretch lg:gap-18" aria-label="BFshop project areas">
          {portalAreas.map((area) => (
            <OneTimeReveal
              key={area.title}
              trigger="load"
              delay={area.title === "Analysis machine" ? 300 : 750}
              className={`${area.title === "Analysis machine" ? "h-full lg:order-2" : area.title === "Project notes" ? "h-full lg:order-3 lg:mt-24 lg:h-[300px] lg:self-start" : "h-full lg:order-1 lg:mt-24 lg:h-[300px] lg:self-start"}`}
            >
            {area.title === "Analysis machine" ? (
              <IntelligenceInterface lightMode={lightMode} />
            ) : area.title === "Project notes" ? (
              <div
                className={`grid h-full min-h-52 gap-4 rounded-lg border p-4 lg:min-h-0 ${lightMode ? "border-zinc-300 bg-white" : "border-white/15 bg-white/[0.06]"}`}
              >
                <Link
                  href="/merchant"
                  className={`flex min-h-0 flex-col justify-center rounded-md border p-4 transition hover:border-sky-400/60 ${lightMode ? "border-zinc-200 bg-zinc-50 hover:bg-sky-50" : "border-white/10 bg-black/10 hover:bg-white/[0.08]"}`}
                >
                  <h2 className={`font-inter text-lg font-semibold leading-snug ${lightMode ? "text-zinc-950" : "text-white"}`}>Merchant</h2>
                  <p className={`mt-2 font-inter text-sm leading-relaxed ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>Enter the merchant workspace for order management and the home of the analysis machine</p>
                </Link>
                <Link
                  href="/customer"
                  className={`flex min-h-0 flex-col justify-center rounded-md border p-4 transition hover:border-sky-400/60 ${lightMode ? "border-zinc-200 bg-zinc-50 hover:bg-sky-50" : "border-white/10 bg-black/10 hover:bg-white/[0.08]"}`}
                >
                  <h2 className={`font-inter text-lg font-semibold leading-snug ${lightMode ? "text-zinc-950" : "text-white"}`}>Customer</h2>
                  <p className={`mt-2 font-inter text-sm leading-relaxed ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>Click here to enter the customer shop for placing orders into the BFshop eco-system</p>
                </Link>
              </div>
            ) : (
              <Link
                href={area.href}
                className={`group flex h-full min-h-52 flex-col justify-between rounded-lg border p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition duration-200 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/80 md:p-8 lg:min-h-0 ${lightMode ? "border-zinc-300 bg-white hover:border-sky-600/60 hover:bg-sky-50" : "border-white/15 bg-white/[0.06] hover:border-sky-400/60 hover:bg-white/[0.1] hover:shadow-[0_24px_56px_rgba(0,0,0,0.42)]"}`}
              >
                <div>
                  <h2 className={`mt-6 font-inter text-xl font-semibold leading-snug md:text-2xl ${lightMode ? "text-zinc-950" : "text-white"}`}>
                    {area.title}
                  </h2>
                  <p className={`mt-3 max-w-md font-inter text-sm leading-relaxed md:text-base ${lightMode ? "text-zinc-600" : "text-zinc-400"}`}>
                    {area.description}
                  </p>
                </div>
              </Link>
            )}
            </OneTimeReveal>
          ))}
        </section>
      </div>

      <OneTimeReveal trigger="scroll">
        <section className={`-mx-4 mt-24 px-4 py-12 md:-mx-6 md:px-6 md:py-16 lg:-mx-8 lg:mt-32 lg:px-8 lg:py-20 ${lightMode ? "bg-white text-zinc-950" : "bg-white text-zinc-950"}`} aria-labelledby="documentation-title">
          <div className="mx-auto max-w-7xl">
          <header className="mx-auto max-w-3xl text-center">
            <h1 id="documentation-title" className="font-bebas text-4xl leading-tight tracking-[0.08em] md:text-5xl lg:text-6xl">Architecture</h1>
            <p className="mt-4 font-inter text-base leading-relaxed text-zinc-600 md:mt-6 md:text-lg">BFshop is a simulated eCommerce business, with a customer interface for placing orders and a merchant interface for managing orders. The merchant interface also includes a section for presenting the findings of the data analysis. This will be presented by a chatbot, which can be conversed with on the findings.</p>
            <br />
            <p className="mt-4 font-inter text-base leading-relaxed text-zinc-600 md:mt-6 md:text-lg">Read how I&apos;m achieving that below.</p>
          </header>

          <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
            <Link href="/playground/vertical-slices" className="flex min-h-44 flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-400 md:p-6">
              <h2 className="font-inter text-lg font-semibold leading-snug text-zinc-950 md:text-xl">Vertical Slices</h2>
              <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-600">Documentation on how each segment of the project is built</p>
            </Link>
            <div className="flex min-h-44 flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:p-6">
              <h2 className="font-inter text-lg font-semibold leading-snug text-zinc-950 md:text-xl">Dev Log</h2>
              <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-600">Ongoing updates on the project&apos;s development</p>
            </div>
            <Link href="/playground/synthetic-economy" className="flex min-h-44 flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-sky-400 md:p-6">
              <h2 className="font-inter text-lg font-semibold leading-snug text-zinc-950 md:text-xl">Synthetic Economy</h2>
              <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-600">Details on how a synthetic economy is used to generate data for analysis</p>
            </Link>
          </div>
          </div>
        </section>
      </OneTimeReveal>
    </main>
  );
}
