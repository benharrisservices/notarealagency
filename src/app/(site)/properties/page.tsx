import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Pagination } from "@/components/ui/pagination";
import { PropertyGrid } from "@/components/property/property-grid";
import { SearchFilters } from "@/components/property/search-filters";
import { SortSelect } from "@/components/property/sort-select";
import { parsePropertyFilters, searchProperties } from "@/lib/properties";
import { getLocationOptions } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Property search",
  description: "Search houses and apartments for sale and to let across East and North-East London.",
};

type SP = Record<string, string | string[] | undefined>;

function flatten(sp: SP): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string" && v !== "") out[k] = v;
    else if (Array.isArray(v) && v[0]) out[k] = v[0];
  }
  return out;
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters = parsePropertyFilters(sp);
  const [{ items, total, page, totalPages }, locations] = await Promise.all([
    searchProperties(filters),
    getLocationOptions(),
  ]);
  const flat = flatten(sp);
  const label = filters.transaction === "LETTING" ? "to let" : filters.transaction === "SALE" ? "for sale" : "available";

  return (
    <div className="border-t border-line bg-paper">
      <Container className="py-10">
        <nav className="mb-4 text-[0.75rem] text-muted">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="px-2">/</span>
          <span>Property search</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink">Property search</h1>
            <p className="mt-2 text-muted">
              {total} {total === 1 ? "property" : "properties"} {label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.75rem] uppercase tracking-[0.1em] text-muted">Sort</span>
            <SortSelect value={filters.sort ?? "newest"} params={flat} />
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line bg-white p-6">
              <h2 className="mb-5 font-display text-xl text-ink">Refine</h2>
              <SearchFilters locations={locations} initial={flat} variant="panel" />
            </div>
            <div className="mt-4 border border-line bg-surface p-5 text-center">
              <p className="text-[0.85rem] text-ink-2">Prefer to search on a map?</p>
              <Link href="/map" className="mt-1 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-accent">
                Open map search →
              </Link>
            </div>
          </aside>

          <div>
            <PropertyGrid properties={items} />
            <Pagination page={page} totalPages={totalPages} params={flat} />
          </div>
        </div>
      </Container>
    </div>
  );
}
