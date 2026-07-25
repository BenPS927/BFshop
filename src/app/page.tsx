import Link from "next/link";
import JsonLd from "./components/shared/jsonld";

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BFshop",
  description:
    "End-to-end e-commerce platform with customer and merchant interfaces, workflow automation, and AI enhancement.",
  url: "https://benfosterdev.com/shop",
  applicationCategory: "ShoppingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
  author: {
    "@type": "Person",
    name: "Ben Foster",
    url: "https://benfosterdev.com",
  },
  hasPart: {
    "@type": "WebApplication",
    name: "BFshop Merchant",
    url: "https://bfshop.benfosterdev.com",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "Ben Foster Dev",
    url: "https://bfshop.benfosterdev.com",
  },
};

export default function BFShop() {
  return (
    <>
      <JsonLd schema={schema} />
      <main className="min-h-screen bg-black bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(255,255,255,0.06),transparent_60%),linear-gradient(180deg,#050505_0%,#0A0A0A_45%,#121212_100%)] px-4 py-6 text-white md:px-6 md:py-8 lg:px-8 lg:py-12">
        <section className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <div className="max-w-2xl">
            <h1 className="mb-4 font-bebas text-4xl leading-tight tracking-[0.12em] md:mb-6 md:text-5xl lg:text-6xl">
              BF<span className="text-sky-400">SHOP</span>
            </h1>

            <p className="font-inter text-base leading-relaxed text-zinc-300 md:text-lg">
              Welcome to BF shop. This will be a simulated business, where AI and automation are used to save would be users time and money.
            </p>
            <p className="font-inter text-sm leading-relaxed text-zinc-400 md:text-base">
                    In early stages of development.
                  </p>
          </div>

          <div className="mt-10 grid w-full gap-4 md:mt-14 md:grid-cols-2 md:gap-6 lg:mt-18 lg:gap-8">
            <Link
              href="/customer"
              className="group rounded-2xl border border-white/20 bg-white/[0.08] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.34)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-white/[0.11] hover:shadow-[0_24px_56px_rgba(0,0,0,0.46)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/80 md:p-6"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="mb-3 font-inter text-xl font-semibold leading-snug text-sky-400 md:mb-4 md:text-2xl lg:text-3xl">
                    Customer
                  </h3>

                  <p className="font-inter text-sm leading-relaxed text-zinc-400 md:text-base">
                    Click here for the customer end of BFshop where you can
                    place orders.
                  </p>
                </div>

                <span className="mt-4 font-inter text-sm font-medium text-zinc-500 transition group-hover:text-zinc-200 md:text-base">
                  Enter -&gt;
                </span>
              </div>
            </Link>

            <Link
              href="/merchant"
              className="group rounded-2xl border border-white/20 bg-white/[0.08] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.34)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-white/[0.11] hover:shadow-[0_24px_56px_rgba(0,0,0,0.46)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/80 md:p-6"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="mb-3 font-inter text-xl font-semibold leading-snug text-sky-400 md:mb-4 md:text-2xl lg:text-3xl">
                    Merchant
                  </h3>

                  <p className="font-inter text-sm leading-relaxed text-zinc-400 md:text-base">
                    This will link to the merchant end of BFshop, which is yet
                    to be built.
                  </p>
                </div>

                <span className="mt-4 font-inter text-sm font-medium text-zinc-500 transition group-hover:text-zinc-200 md:text-base">
                  Enter -&gt;
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
