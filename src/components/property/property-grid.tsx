import { PropertyCard } from "./property-card";
import type { PropertyCard as PropertyCardType } from "@/lib/properties";

export function PropertyGrid({ properties }: { properties: PropertyCardType[] }) {
  if (properties.length === 0) {
    return (
      <div className="border border-dashed border-line bg-surface py-20 text-center">
        <p className="font-display text-2xl text-ink">No properties match your search</p>
        <p className="mt-2 text-muted">Try widening your filters, or clear them to see everything available.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
