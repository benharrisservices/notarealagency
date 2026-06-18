import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PropertyMap, type MapMarker } from "@/components/property/property-map";
import { parsePropertyFilters, getMapProperties } from "@/lib/properties";
import { formatPrice, bedLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Map search",
  description: "Search London property on an interactive map.",
};

type SP = Record<string, string | string[] | undefined>;

function shortPrice(price: number, transaction: string): string {
  if (transaction === "LETTING") return `£${Math.round(price / 50) * 50}`;
  if (price >= 1_000_000) return `£${(price / 1_000_000).toFixed(2)}m`;
  return `£${Math.round(price / 1000)}k`;
}

export default async function MapPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters = parsePropertyFilters(sp);
  const properties = await getMapProperties(filters);
  const markers: MapMarker[] = properties
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      lat: p.latitude as number,
      lng: p.longitude as number,
      label: shortPrice(p.price, p.transactionType),
      href: `/properties/${p.slug}`,
    }));

  return (
    <div className="border-t border-line">
      <Container className="py-6">
        <h1 className="font-display text-3xl text-ink">Map search</h1>
        <p className="mt-1 text-muted">{properties.length} properties · select a pin to view</p>
      </Container>
      <div className="grid lg:grid-cols-[420px_1fr]">
        <div className="order-2 max-h-[80vh] overflow-y-auto border-t border-line lg:order-1 lg:border-r lg:border-t-0">
          {properties.map((p) => (
            <Link key={p.id} href={`/properties/${p.slug}`} className="flex gap-4 border-b border-line-2 p-4 hover:bg-surface">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-surface-2">
                {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="120px" className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg text-ink">{formatPrice(p)}</p>
                <p className="truncate text-[0.85rem] text-ink-2">{p.title}</p>
                <p className="text-[0.8rem] text-muted">{p.displayAddress} · {bedLabel(p.bedrooms)}</p>
              </div>
            </Link>
          ))}
          {properties.length === 0 && <p className="p-6 text-muted">No properties to show on the map.</p>}
        </div>
        <div className="order-1 lg:order-2">
          <PropertyMap markers={markers} className="h-[50vh] lg:h-[80vh]" />
        </div>
      </div>
    </div>
  );
}
