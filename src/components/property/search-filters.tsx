"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Label, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type LocationOption = { slug: string; name: string; region?: string | null };
type Values = Record<string, string>;

const PROPERTY_TYPES = [
  ["APARTMENT", "Apartment"],
  ["FLAT", "Flat"],
  ["STUDIO", "Studio"],
  ["MAISONETTE", "Maisonette"],
  ["PENTHOUSE", "Penthouse"],
  ["TERRACED", "Terraced house"],
  ["SEMI_DETACHED", "Semi-detached"],
  ["DETACHED", "Detached"],
  ["TOWNHOUSE", "Townhouse"],
  ["MEWS", "Mews"],
];

const TENURES = [
  ["FREEHOLD", "Freehold"],
  ["LEASEHOLD", "Leasehold"],
  ["SHARE_OF_FREEHOLD", "Share of freehold"],
];

const OUTDOOR = [
  ["true", "Any outdoor space"],
  ["GARDEN", "Private garden"],
  ["TERRACE", "Terrace"],
  ["ROOF_TERRACE", "Roof terrace"],
  ["BALCONY", "Balcony"],
];

export function SearchFilters({
  locations,
  initial = {},
  variant = "panel",
}: {
  locations: LocationOption[];
  initial?: Values;
  variant?: "hero" | "panel";
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>(initial);

  const set = (key: string, value: string) => setV((prev) => ({ ...prev, [key]: value }));

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    Object.entries(v).forEach(([k, val]) => {
      if (val && val !== "" && val !== "ANY") params.set(k, val);
    });
    router.push(`/properties?${params.toString()}`);
  }

  function clearAll() {
    setV({});
    router.push("/properties");
  }

  const locationSelect = (
    <Select value={v.location ?? ""} onChange={(e) => set("location", e.target.value)} aria-label="Location">
      <option value="">All areas</option>
      {locations.map((l) => (
        <option key={l.slug} value={l.slug}>
          {l.name}
        </option>
      ))}
    </Select>
  );

  const bedsSelect = (
    <Select value={v.minBeds ?? ""} onChange={(e) => set("minBeds", e.target.value)} aria-label="Minimum bedrooms">
      <option value="">Any beds</option>
      <option value="0">Studio</option>
      <option value="1">1+</option>
      <option value="2">2+</option>
      <option value="3">3+</option>
      <option value="4">4+</option>
    </Select>
  );

  if (variant === "hero") {
    return (
      <form onSubmit={submit} className="border border-line bg-white p-3">
        <div className="grid gap-2 md:grid-cols-[auto_1fr_1fr_1fr_auto] md:items-stretch">
          <div className="flex border border-line">
            {[
              ["SALE", "Buy"],
              ["LETTING", "Rent"],
            ].map(([val, label]) => (
              <button
                type="button"
                key={val}
                onClick={() => set("transaction", val)}
                className={cn(
                  "px-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                  (v.transaction ?? "SALE") === val ? "bg-ink text-white" : "text-ink-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {locationSelect}
          {bedsSelect}
          <Input
            type="number"
            placeholder="Max price"
            value={v.maxPrice ?? ""}
            onChange={(e) => set("maxPrice", e.target.value)}
          />
          <Button type="submit" variant="primary" className="md:px-8">
            Search
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label>Buying or renting</Label>
        <div className="flex border border-line">
          {[
            ["", "All"],
            ["SALE", "Buy"],
            ["LETTING", "Rent"],
          ].map(([val, label]) => (
            <button
              type="button"
              key={label}
              onClick={() => set("transaction", val)}
              className={cn(
                "flex-1 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                (v.transaction ?? "") === val ? "bg-ink text-white" : "text-ink-2 hover:bg-surface-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Location</Label>
        {locationSelect}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min price</Label>
          <Input type="number" placeholder="No min" value={v.minPrice ?? ""} onChange={(e) => set("minPrice", e.target.value)} />
        </div>
        <div>
          <Label>Max price</Label>
          <Input type="number" placeholder="No max" value={v.maxPrice ?? ""} onChange={(e) => set("maxPrice", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Bedrooms</Label>
          {bedsSelect}
        </div>
        <div>
          <Label>Bathrooms</Label>
          <Select value={v.minBaths ?? ""} onChange={(e) => set("minBaths", e.target.value)}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </Select>
        </div>
      </div>

      <div>
        <Label>Property type</Label>
        <Select value={v.type ?? ""} onChange={(e) => set("type", e.target.value)}>
          <option value="">Any type</option>
          {PROPERTY_TYPES.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Tenure</Label>
        <Select value={v.tenure ?? ""} onChange={(e) => set("tenure", e.target.value)}>
          <option value="">Any tenure</option>
          {TENURES.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Outdoor space</Label>
        <Select value={v.outdoor ?? ""} onChange={(e) => set("outdoor", e.target.value)}>
          <option value="">Any</option>
          {OUTDOOR.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2.5 border-t border-line-2 pt-4">
        <label className="flex items-center gap-3 text-[0.9rem] text-ink-2">
          <input
            type="checkbox"
            checked={v.parking === "true"}
            onChange={(e) => set("parking", e.target.checked ? "true" : "")}
            className="h-4 w-4 accent-[#284b3a]"
          />
          Parking
        </label>
        <label className="flex items-center gap-3 text-[0.9rem] text-ink-2">
          <input
            type="checkbox"
            checked={v.chainFree === "true"}
            onChange={(e) => set("chainFree", e.target.checked ? "true" : "")}
            className="h-4 w-4 accent-[#284b3a]"
          />
          Chain free only
        </label>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" variant="primary" className="flex-1">Search</Button>
        <Button type="button" variant="outline" onClick={clearAll}>Clear</Button>
      </div>
    </form>
  );
}
