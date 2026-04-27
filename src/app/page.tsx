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
      <main className="min-h-screen bg-neutral-100 px-4 py-6 text-neutral-950 md:px-6 md:py-8 lg:px-8 lg:py-12">
        <section className="mx-auto flex max-w-7xl flex-col items-center space-y-6 text-center md:space-y-8 lg:space-y-12">
          <div className="max-w-2xl">
            <h1 className="mb-4 font-bebas text-4xl leading-tight tracking-wide md:mb-6 md:text-5xl lg:text-6xl">
              BF<span className="text-[orange]">SHOP</span>
            </h1>

            <p className="font-inter text-base leading-relaxed text-gray-600 md:text-lg">
              Welcome to BFShop, my first AI enhanced business system. The two
              panels below link to either end of BFShop. Both ends share the
              same backend, so you can see orders you place in the customer side
              appear in the merchant side.
            </p>
          </div>

          <div className="grid w-full gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
            <Link
              href="/customer"
              className="group rounded-2xl border border-neutral-900/15 bg-neutral-900/[0.03] p-4 transition hover:bg-neutral-900/[0.06] md:p-6"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="mb-3 font-inter text-xl font-semibold leading-snug text-[orange] md:mb-4 md:text-2xl lg:text-3xl">
                    Customer
                  </h3>

                  <p className="font-inter text-sm leading-relaxed text-gray-500 md:text-base">
                    Click here for the customer end of BFshop where you can
                    place orders.
                  </p>
                </div>

                <span className="mt-4 font-inter text-sm font-medium text-gray-500 transition group-hover:text-neutral-950 md:text-base">
                  Enter -&gt;
                </span>
              </div>
            </Link>

            <Link
              href="/playground/page-two"
              className="group rounded-2xl border border-neutral-900/15 bg-neutral-900/[0.03] p-4 transition hover:bg-neutral-900/[0.06] md:p-6"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="mb-3 font-inter text-xl font-semibold leading-snug text-[orange] md:mb-4 md:text-2xl lg:text-3xl">
                    Merchant
                  </h3>

                  <p className="font-inter text-sm leading-relaxed text-gray-500 md:text-base">
                    This will link to the merchant end of BFshop, which is yet
                    to be built.
                  </p>
                </div>

                <span className="mt-4 font-inter text-sm font-medium text-gray-500 transition group-hover:text-neutral-950 md:text-base">
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
