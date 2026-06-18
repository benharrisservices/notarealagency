import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-display text-2xl uppercase tracking-[0.3em]">{siteConfig.wordmark}</span>
            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-white/40">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{siteConfig.description}</p>
            <div className="mt-6 space-y-1 text-sm text-white/70">
              <p>{siteConfig.address.line1}</p>
              <p>{siteConfig.address.line2}</p>
              <p>
                {siteConfig.address.city} {siteConfig.address.postcode}
              </p>
              <p className="pt-2">
                <a href={siteConfig.phoneHref} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>

          {siteConfig.footerNav.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white/50">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.74rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-white/80">
              About
            </Link>
            <Link href="/contact" className="hover:text-white/80">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-white/80">
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
