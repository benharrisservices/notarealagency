import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Hero } from "@/components/home/hero";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { SearchFilters } from "@/components/property/search-filters";
import { opportunityTypes } from "@/lib/opportunities";
import { getFeaturedProperties } from "@/lib/properties";
import { getLocationOptions, getAreaGuides } from "@/lib/content";

export const dynamic = "force-dynamic";

const PILLARS: [string, string][] = [
  ["Curated opportunities", "A tightly edited index, not an endless portal. Every listing earns its place."],
  ["Better buying", "Clearer information, earlier access and honest guidance on what a thing is worth."],
  ["Property intelligence", "Area knowledge, architectural quality and the numbers that actually matter."],
];

export default async function HomePage() {
  const [featured, locations, guides] = await Promise.all([
    getFeaturedProperties(3),
    getLocationOptions(),
    getAreaGuides(),
  ]);

  return (
    <>
      {/* SCREEN ONE — sell NARA */}
      <Hero />

      {/* Thesis */}
      <Section surface>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <Eyebrow className="mb-4">What NARA is</Eyebrow>
              <h2 className="font-display text-3xl leading-tight text-ink sm:text-[2.6rem]">
                Not an estate agency in the traditional sense.
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted">
              A curated platform for property opportunities — assembled with an editor&rsquo;s eye and an
              investor&rsquo;s discipline, for buyers who want to move earlier and decide better.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {PILLARS.map(([title, body]) => (
              <div key={title} className="bg-paper p-8">
                <h3 className="font-display text-2xl text-ink">{title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Opportunity types */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="What we cover"
            title="Eight kinds of opportunity"
            intro="NARA spans the full spectrum of London property — from homes to held assets."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {opportunityTypes.map((o) => (
              <Link key={o.key} href="/properties" className="group flex flex-col bg-paper p-7">
                <h3 className="font-display text-xl text-ink">{o.label}</h3>
                <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-muted">{o.blurb}</p>
                <span className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Search the index */}
      <Section surface>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="mb-3">The index</Eyebrow>
            <h2 className="font-display text-3xl text-ink sm:text-[2.4rem]">Search every opportunity</h2>
            <p className="mt-3 text-muted">Filter by location, price, type, tenure and outdoor space.</p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <SearchFilters locations={locations} variant="hero" />
          </div>
        </Container>
      </Section>

      {/* SCREEN TWO — sell the opportunities (photography lives here) */}
      <FeaturedProperties properties={featured} />

      {/* Area intelligence */}
      {guides.length > 0 && (
        <Section surface>
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <Eyebrow className="mb-3">Area intelligence</Eyebrow>
                <h2 className="font-display text-3xl sm:text-[2.6rem]">Know the ground</h2>
              </div>
              <Link href="/areas" className="hidden shrink-0 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-ink-2 hover:text-accent sm:inline">
                All areas →
              </Link>
            </div>
            <div className="grid gap-7 md:grid-cols-3">
              {guides.slice(0, 3).map((g) => (
                <Link key={g.slug} href={`/areas/${g.slug}`} className="group">
                  <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
                    {g.heroImage && (
                      <Image src={g.heroImage} alt={g.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-ink">{g.location?.name ?? g.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[0.9rem] text-muted">{g.intro}</p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Closing */}
      <Section className="text-center">
        <Container>
          <Eyebrow className="mb-4">Bringing a property to market?</Eyebrow>
          <h2 className="mx-auto max-w-2xl font-display text-3xl sm:text-[2.8rem]">
            If you have a home, an asset or a site, we&rsquo;d like to hear about it
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Sales, lettings and considered advice on bringing the right opportunity to the right buyer.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/contact" variant="primary">Talk to NARA</ButtonLink>
            <ButtonLink href="/valuation" variant="outline">Request a valuation</ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
