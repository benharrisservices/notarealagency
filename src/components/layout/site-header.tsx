import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${siteConfig.name} — home`}>
          <span className="font-display text-2xl uppercase tracking-[0.3em] text-ink">{siteConfig.wordmark}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {siteConfig.primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.74rem] font-medium uppercase tracking-[0.12em] text-ink-2 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.phoneHref}
            className="hidden text-[0.78rem] font-medium text-ink-2 transition-colors hover:text-accent xl:inline"
          >
            {siteConfig.phone}
          </a>
          <Link
            href="/valuation"
            className="hidden bg-ink px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent lg:inline-block"
          >
            Book a valuation
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
