import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/app/components/shared/jsonld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
 title: {
    default: "BFshop | AI Enhanced Business System",
    template: "%s | BFshop",
  },
  description: "An end to end business system featuring a customer and merchant end with an active backend, enhanced by AI. Built with Next JS.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BFshop",
    description:
      "An end to end business system featuring a customer and merchant end with an active backend, enhanced by AI.",
    url: "https://example.com",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <JsonLd schema={websiteSchema} />
      </body>
    </html>
  );
}
