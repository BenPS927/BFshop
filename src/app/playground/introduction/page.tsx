"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";

export default function ProjectIntroductionPage() {
  const { lightMode, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors md:px-6 md:py-8 lg:px-8 lg:py-12 ${lightMode ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-white"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-inter text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`}
            title={`Switch to ${lightMode ? "dark" : "light"} mode`}
            className={`grid size-11 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}
          >
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </div>

        <article className="mx-auto mt-10 max-w-4xl bg-white px-8 py-12 text-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.22)] md:mt-16 md:px-16 md:py-20 lg:px-24">
          <h1 className="font-bebas text-4xl leading-tight tracking-[0.08em] md:text-5xl">Introduction to BFshop</h1>
          <div className="mt-8 border-t border-zinc-200 pt-8 font-inter text-base leading-relaxed md:mt-10 md:pt-10">
            <p>BFshop is an experimental eCommerce intelligence system built around a simulated online store. It analyses business data to find useful patterns and information, then uses AI to present and discuss what it finds with the merchant. The project is a testing ground for exploring how data analysis and AI can work together to make business information more useful and easier to understand.</p>

            <section className="mt-10">
              <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">Overview</h2>
              <div className="mt-4 space-y-4 text-zinc-700">
                <p>BFshop is an experiment that has changed continuously. It was always planned to be an eCommerce store, with both a customer and merchant interface with a shared backend.</p>
                <p>It was to be an AI enhanced project, experimenting with how AI can be utilised to improve modern business systems.</p>
                <p>It was to do this by including:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Customer service chatbot</li>
                  <li>AI assistant for the merchant interface for facilitating workflow and assessing business data</li>
                  <li>An AI Overwatch feature for monitoring AI activity and behaviour</li>
                </ul>
                <p>Over time I realised that, in this context at least, AI&apos;s utility is not in a simple chat interface or as an assistant taking orders, but in assessing information and being able to converse on that information.</p>
                <p>I then identified what I believe is lacking in analysis apps for eCommerce stores:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Offer findings without being asked</li>
                  <li>Connect findings to potential business actions, with the potentiality of acting on them</li>
                  <li>Be easier to use</li>
                  <li>Offer easier to understand information and data</li>
                </ul>
                <p>BFshop&apos;s simulated eCommerce environment offers an ideal ground for passing data through, which could then be analysed. The logical progression was to turn BFshop into an experiment exploring a possible solution to these problems.</p>
                <p>It will attempt this with the generation of business data into its ecosystem, analysis and presentation of useful findings by a query-able AI chat interface.</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">Three Main Features</h2>
              <div className="mt-4 space-y-4 text-zinc-700">
                <ul className="list-disc space-y-2 pl-6">
                  <li>A backend analysis machine for the simulated data</li>
                  <li>Merchant management platform, including an AI chat interface for presenting and discussing data</li>
                  <li>The eCommerce store frontend where orders can be placed</li>
                </ul>
                <p>A synthetic economy will be used to simulate the generation of business data. This will involve two main features:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>A workflow storing a base of customers with characteristics which simulate buying behaviour by generating orders at the store frontend</li>
                  <li>A business action and external factor generator, including discounts, ad campaigns, and economic events that influence customer characteristics and buying behaviour</li>
                </ul>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">BFshop Intentions</h2>
              <div className="mt-4 space-y-4 text-zinc-700">
                <p><strong>Answer the question the user doesn&apos;t know to ask.</strong> BFshop should not require merchants to know what they are looking for. It should proactively surface information worth their attention.</p>
                <p><strong>Ease of use and understanding.</strong> Apps often require long setups, technical knowledge, and display many dashboards. BFshop aims to be easy to use and understand, both in the interface and the chatbot.</p>
                <p><strong>Convert data into potential business action.</strong> Deterministic analysis tools will turn business data into structured findings. The AI will have access to these findings and analytical tools so that it can explain what matters, investigate further, and suggest potential actions.</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">Architecture</h2>
              <div className="mt-4 space-y-4 text-zinc-700">
                <p>The project is being built with Next.js, Neon Postgres, and n8n for workflow automation.</p>
                <p>It is split into slices. Each represents a vertical slice between the frontend and the backend, aside from slices involving external input. The slices vaguely represent the chronological progress of the project, but they may change and be added to over time.</p>
                <h3 className="pt-2 font-inter text-xl font-semibold text-zinc-950 md:text-2xl">The Slices</h3>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Slice 1: Place Order</strong> - The customer end of BFshop, where one can place orders.</li>
                  <li><strong>Slice 2: Manage Orders</strong> - The merchant end of BFshop, where the merchant can view and manage orders.</li>
                  <li><strong>Slice 3: Metrics and History</strong> - The calculation and storage of business metrics.</li>
                  <li><strong>Slice 4: Findings and Relationships</strong> - Deterministic analysis to identify noteworthy changes, patterns, and relationships, with significant findings stored historically.</li>
                  <li><strong>Slice 5: Intelligence Interface</strong> - Giving the AI relevant current and historical findings so it can explain what matters, answer merchant questions, and suggest actions.</li>
                </ul>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-inter text-2xl font-semibold leading-snug md:text-3xl">Personal Motivation</h2>
              <div className="mt-4 space-y-4 text-zinc-700">
                <blockquote className="border-l-4 border-sky-500 pl-4 italic">In this context, AI&apos;s utility is not in a simple chat interface or as an assistant taking orders, but in assessing information and being able to converse on that information.</blockquote>
                <p>This is influenced by my experience with apps and software over the years and AI in recent years.</p>
                <p>I have often found myself overloaded by apps heavy in metrics, dashboards, and numbers. In recent years, my ability and knowledge in a variety of areas has improved enormously due to having AI to discuss these things with.</p>
                <p>Not because I simply have AI do things for me, but because it serves as someone to bounce ideas off: to fill gaps in my knowledge and illustrate things not gleaned from existing tutorials, textbooks, or dashboards.</p>
                <p>The obvious next step would be AI that offers information without being asked. In the context of a business intelligence system, this is arguably more helpful because the user does not need to know what question to ask.</p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
