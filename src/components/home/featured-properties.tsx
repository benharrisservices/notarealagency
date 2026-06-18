import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section, Eyebrow } from "@/components/ui/section";
import { PropertyGrid } from "@/components/property/property-grid";
import type { PropertyCard } from "@/lib/properties";

export function FeaturedProperties({ properties }: { properties: PropertyCard[] }) {
  if (!properties.length) return null;
  return (
    <Section className="pt-24">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-3">On the market</Eyebrow>
            <h2 className="font-display text-3xl sm:text-[2.6rem]">Selected opportunities</h2>
          </div>
          <Link
            href="/properties"
            className="hidden shrink-0 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-ink-2 hover:text-accent sm:inline"
          >
            View all →
          </Link>
        </div>
        <PropertyGrid properties={properties} />
      </Container>
    </Section>
  );
}
