"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { label: "BFdev", href: "https://benfosterdev.com/", external: true },
  { label: "Portal", href: "/", external: false },
  { label: "Merchant", href: "/merchant", external: false },
  { label: "Customer", href: "/customer", external: false },
  { label: "Intelligence Interface", href: "/merchant/data", external: false },
  { label: "Order Hub", href: "/merchant/orders", external: false },
] as const;

type ProjectNavigationProps = {
  lightMode: boolean;
  accent?: "sky" | "orange";
};

export function ProjectNavigation({ lightMode, accent = "sky" }: ProjectNavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentItem = navigationItems.find((item) => !item.external && item.href === pathname) ?? navigationItems[1];

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const surface = lightMode
    ? "border-zinc-300 bg-white text-zinc-700 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
    : "border-white/20 bg-zinc-900 text-zinc-300 shadow-[0_16px_36px_rgba(0,0,0,0.3)]";
  const active = accent === "orange"
    ? "text-orange-600"
    : lightMode ? "text-sky-700" : "text-sky-300";
  const hover = lightMode ? "hover:bg-zinc-100 hover:text-zinc-950" : "hover:bg-white/[0.08] hover:text-white";

  function navigationLink(item: (typeof navigationItems)[number]) {
    const isCurrent = !item.external && item.href === pathname;
    const classes = `block rounded px-3 py-2 font-inter transition ${isCurrent ? `text-base font-semibold ${active}` : `text-sm font-medium ${hover}`}`;

    return item.external ? (
      <a key={item.label} href={item.href} className={classes}>{item.label}</a>
    ) : (
      <Link key={item.label} href={item.href} className={classes} aria-current={isCurrent ? "page" : undefined}>{item.label}</Link>
    );
  }

  return (
    <nav ref={containerRef} aria-label="BFshop project navigation" className="relative z-50 w-fit">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 min-w-28 items-center justify-between gap-3 rounded-md border px-3 font-inter text-sm font-semibold transition sm:hidden ${surface}`}
      >
        <span className={active}>{currentItem.label}</span>
        <span aria-hidden="true" className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      <div className={`absolute left-0 top-full mt-2 min-w-52 rounded-lg border p-2 transition-[opacity,transform] duration-200 ease-out sm:static sm:mt-0 sm:flex sm:min-w-48 sm:flex-col sm:opacity-100 sm:translate-y-0 ${surface} ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0 sm:pointer-events-auto"}`}>
        {navigationItems.map(navigationLink)}
      </div>
    </nav>
  );
}
