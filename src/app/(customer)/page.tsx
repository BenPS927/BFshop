import BFCustomerPage from "./bf-customer";
import JsonLd from "../components/shared/jsonld"
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: "BFshop",
  description: "This is the customer end of BFshop, an under construction AI enhanced business system.",
}

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BFshop",
  "description": "End-to-end e-commerce platform with customer and merchant interfaces, workflow automation, and AI enhancement.",
  "url": "https://benfosterdev.com/shop",
  "applicationCategory": "ShoppingApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "GBP"
  },
  "author": {
    "@type": "Person",
    "name": "Ben Foster",
    "url": "https://benfosterdev.com"
  },
  "hasPart": {
    "@type": "WebApplication",
    "name": "BFshop Merchant",
    "url": "https://bfmerchant.benfosterdev.com"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "Ben Foster Dev",
    "url": "https://benfosterdev.com"
  }
}

export default function BFShop(){
    return (
        <div>
            <JsonLd schema={schema} />
            <BFCustomerPage />
        </div>
    )
}