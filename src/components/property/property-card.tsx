import Image from "next/image";
import Link from "next/link";
import { formatPrice, bedLabel, OUTDOOR_LABEL, formatArea } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import type { PropertyCard as PropertyCardType } from "@/lib/properties";

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-ink-2">
      <span className="text-accent">{icon}</span>
      {label}
    </span>
  );
}

export function PropertyCard({ property }: { property: PropertyCardType }) {
  const cover = property.images[0]?.url ?? "/brand/og-default.jpg";
  const area = formatArea(property.floorAreaSqft, property.floorAreaSqm);

  return (
    <Link href={`/properties/${property.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Image
          src={cover}
          alt={property.images[0]?.alt ?? property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <StatusBadge status={property.status} />
          {property.chainFree && property.transactionType === "SALE" && (
            <span className="bg-white/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink">
              Chain free
            </span>
          )}
        </div>
        {property.outdoorSpace !== "NONE" && (
          <span className="absolute bottom-3 left-3 bg-ink/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
            {OUTDOOR_LABEL[property.outdoorSpace]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="font-display text-2xl text-ink">{formatPrice(property)}</p>
        <h3 className="mt-1 text-[0.95rem] font-medium text-ink">{property.title}</h3>
        <p className="mt-0.5 text-[0.85rem] text-muted">{property.displayAddress}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line-2 pt-3">
          <Stat
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18v2M21 18v2M5 11V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2" />
              </svg>
            }
            label={bedLabel(property.bedrooms)}
          />
          <Stat
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2" />
              </svg>
            }
            label={`${property.bathrooms} bath`}
          />
          {area && (
            <Stat
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 3h18v18H3zM3 9h18M9 9v12" />
                </svg>
              }
              label={area}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
