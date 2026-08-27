import JsonLd from "./components/shared/jsonld";
import BlankPlaygroundPage from "./playground/blank/page";

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
      <BlankPlaygroundPage />
    </>
  );
}
