import Link from "next/link";

export default function MerchantPage() {
  return (
    <main className="min-h-screen bg-black bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#050505_0%,#0A0A0A_45%,#121212_100%)] px-4 py-6 text-white md:px-6 md:py-8 lg:px-8 lg:py-12">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col items-center justify-center text-center md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-6rem)]">
        <Link
          href="/"
          className="mb-8 font-inter text-xs font-semibold uppercase tracking-[0.14em] text-sky-400 transition hover:text-sky-300"
        >
          Back to BFshop
        </Link>

        <div className="rounded-2xl border border-white/20 bg-white/[0.08] px-8 py-10 shadow-[0_16px_40px_rgba(0,0,0,0.34)] sm:px-12 sm:py-12">
          <p className="font-bebas text-5xl leading-none tracking-[0.14em] text-white sm:text-6xl lg:text-8xl">
            In <span className="text-sky-400">Design</span> Stages
          </p>
        </div>

        <Link
          href="https://benfosterdev.com/blog/blog-bfshop"
          className="mt-6 font-inter text-xs font-semibold uppercase tracking-[0.14em] text-sky-400 transition hover:text-sky-300"
        >
          Project portal
        </Link>
      </section>
    </main>
  );
}