"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span className={cn("h-[1.5px] w-6 bg-ink transition-transform", open && "translate-y-[6.5px] rotate-45")} />
        <span className={cn("h-[1.5px] w-6 bg-ink transition-opacity", open && "opacity-0")} />
        <span className={cn("h-[1.5px] w-6 bg-ink transition-transform", open && "-translate-y-[6.5px] -rotate-45")} />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-paper px-6 pb-10 pt-24 transition-transform duration-500 ease-smooth",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="flex flex-col">
          {siteConfig.primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line-2 py-4 font-display text-2xl text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/valuation"
            onClick={() => setOpen(false)}
            className="mt-8 bg-ink px-6 py-4 text-center text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-white"
          >
            Book a valuation
          </Link>
        </nav>
      </div>
    </div>
  );
}
