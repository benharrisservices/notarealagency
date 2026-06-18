"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input, Textarea, Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type AnyProperty = Record<string, unknown> & { id?: string };

const TYPES = [
  "APARTMENT", "FLAT", "STUDIO", "TERRACED", "SEMI_DETACHED", "DETACHED",
  "MAISONETTE", "TOWNHOUSE", "BUNGALOW", "PENTHOUSE", "MEWS", "NEW_BUILD",
];
const STATUSES = ["DRAFT", "AVAILABLE", "UNDER_OFFER", "SOLD", "LET_AGREED", "LET", "WITHDRAWN"];
const TENURES = ["FREEHOLD", "LEASEHOLD", "SHARE_OF_FREEHOLD", "COMMONHOLD"];
const QUALIFIERS: [string, string][] = [
  ["GUIDE", "Sale price"],
  ["OFFERS_OVER", "Offers over"],
  ["OFFERS_IN_EXCESS_OF", "Offers in excess of"],
  ["FIXED", "Fixed price"],
  ["FROM", "From"],
  ["POA", "Price on application"],
];
const OUTDOOR = ["NONE", "BALCONY", "PATIO", "GARDEN", "TERRACE", "ROOF_TERRACE", "COMMUNAL_GARDEN"];

function str(v: unknown, fallback = ""): string {
  return v === null || v === undefined ? fallback : String(v);
}

export function PropertyForm({ property, mode }: { property?: AnyProperty; mode: "create" | "edit" }) {
  const router = useRouter();
  const p = property ?? {};
  const initialImages = Array.isArray(p.images)
    ? (p.images as { url: string }[]).map((i) => i.url).join("\n")
    : "";

  const [form, setForm] = useState({
    title: str(p.title),
    slug: str(p.slug),
    reference: str(p.reference),
    summary: str(p.summary),
    description: str(p.description),
    transactionType: str(p.transactionType, "SALE"),
    status: str(p.status, "AVAILABLE"),
    propertyType: str(p.propertyType, "APARTMENT"),
    tenure: str(p.tenure, "LEASEHOLD"),
    price: str(p.price, "0"),
    priceQualifier: str(p.priceQualifier, "GUIDE"),
    rentFrequency: str(p.rentFrequency, "PCM"),
    bedrooms: str(p.bedrooms, "0"),
    bathrooms: str(p.bathrooms, "0"),
    receptions: str(p.receptions, "0"),
    floorAreaSqft: str(p.floorAreaSqft),
    features: Array.isArray(p.features) ? (p.features as string[]).join("\n") : "",
    displayAddress: str(p.displayAddress),
    postcode: str(p.postcode),
    latitude: str(p.latitude),
    longitude: str(p.longitude),
    outdoorSpace: str(p.outdoorSpace, "NONE"),
    councilTaxBand: str(p.councilTaxBand),
    epcRating: str(p.epcRating),
    chainFree: Boolean(p.chainFree),
    newBuild: Boolean(p.newBuild),
    parking: Boolean(p.parking),
    featured: Boolean(p.featured),
    imageUrls: initialImages,
  });

  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const payload = {
      ...form,
      tenure: form.transactionType === "LETTING" ? null : form.tenure,
      rentFrequency: form.transactionType === "LETTING" ? form.rentFrequency : null,
      floorAreaSqft: form.floorAreaSqft || null,
      councilTaxBand: form.councilTaxBand || null,
      epcRating: form.epcRating || null,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      images: form.imageUrls.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = mode === "create" ? "/api/properties" : `/api/properties/${p.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Could not save the property.");
      }
      router.push("/admin/properties");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save.");
    }
  }

  const card = "border border-line bg-white p-6";
  const grid2 = "grid gap-x-4 sm:grid-cols-2";
  const grid3 = "grid gap-x-4 sm:grid-cols-3";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className={card}>
          <h2 className="mb-4 font-display text-xl text-ink">Overview</h2>
          <Field label="Title"><Input value={form.title} onChange={(e) => update("title", e.target.value)} required /></Field>
          <div className={grid2}>
            <Field label="Slug (URL)"><Input value={form.slug} onChange={(e) => update("slug", e.target.value)} required /></Field>
            <Field label="Reference"><Input value={form.reference} onChange={(e) => update("reference", e.target.value)} required /></Field>
          </div>
          <Field label="Summary"><Textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} required /></Field>
          <Field label="Full description"><Textarea className="min-h-[180px]" value={form.description} onChange={(e) => update("description", e.target.value)} required /></Field>
        </div>

        <div className={card}>
          <h2 className="mb-4 font-display text-xl text-ink">Specification</h2>
          <div className={grid3}>
            <Field label="Bedrooms"><Input type="number" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} /></Field>
            <Field label="Bathrooms"><Input type="number" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} /></Field>
            <Field label="Receptions"><Input type="number" value={form.receptions} onChange={(e) => update("receptions", e.target.value)} /></Field>
          </div>
          <div className={grid3}>
            <Field label="Property type">
              <Select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Floor area (sq ft)"><Input type="number" value={form.floorAreaSqft} onChange={(e) => update("floorAreaSqft", e.target.value)} /></Field>
            <Field label="Outdoor space">
              <Select value={form.outdoorSpace} onChange={(e) => update("outdoorSpace", e.target.value)}>
                {OUTDOOR.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>
          <div className={grid3}>
            <Field label="Council tax band"><Input value={form.councilTaxBand} onChange={(e) => update("councilTaxBand", e.target.value)} /></Field>
            <Field label="EPC rating"><Input value={form.epcRating} onChange={(e) => update("epcRating", e.target.value)} /></Field>
            <Field label="Tenure">
              <Select value={form.tenure} onChange={(e) => update("tenure", e.target.value)} disabled={form.transactionType === "LETTING"}>
                {TENURES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Key features (one per line)">
            <Textarea value={form.features} onChange={(e) => update("features", e.target.value)} placeholder={"Private roof terrace\nOpen plan living\nChain free"} />
          </Field>
        </div>

        <div className={card}>
          <h2 className="mb-4 font-display text-xl text-ink">Location</h2>
          <Field label="Display address"><Input value={form.displayAddress} onChange={(e) => update("displayAddress", e.target.value)} required /></Field>
          <div className={grid3}>
            <Field label="Postcode"><Input value={form.postcode} onChange={(e) => update("postcode", e.target.value)} required /></Field>
            <Field label="Latitude"><Input value={form.latitude} onChange={(e) => update("latitude", e.target.value)} /></Field>
            <Field label="Longitude"><Input value={form.longitude} onChange={(e) => update("longitude", e.target.value)} /></Field>
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-4 font-display text-xl text-ink">Media</h2>
          <Field label="Image URLs (one per line, paths under /public)">
            <Textarea value={form.imageUrls} onChange={(e) => update("imageUrls", e.target.value)} placeholder="/properties/cable-street-e1/01-reception.jpg" />
          </Field>
          <p className="text-[0.74rem] text-muted">
            This scaffold references media already in <code>/public</code>. Connect Vercel Blob or S3 for direct file uploads.
          </p>
        </div>
      </div>

      <aside className="space-y-6">
        <div className={`${card} lg:sticky lg:top-6`}>
          <h2 className="mb-4 font-display text-xl text-ink">Listing</h2>
          <Field label="Transaction">
            <Select value={form.transactionType} onChange={(e) => update("transactionType", e.target.value)}>
              <option value="SALE">For sale</option>
              <option value="LETTING">To let</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => update("status", e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label={form.transactionType === "LETTING" ? "Rent (per period)" : "Price (£)"}>
            <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required />
          </Field>
          <div className={grid2}>
            <Field label="Qualifier">
              <Select value={form.priceQualifier} onChange={(e) => update("priceQualifier", e.target.value)}>
                {QUALIFIERS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </Select>
            </Field>
            {form.transactionType === "LETTING" && (
              <Field label="Frequency">
                <Select value={form.rentFrequency} onChange={(e) => update("rentFrequency", e.target.value)}>
                  <option value="PCM">pcm</option>
                  <option value="PW">pw</option>
                </Select>
              </Field>
            )}
          </div>

          <div className="space-y-2.5 border-t border-line-2 pt-4">
            {([["featured", "Featured on homepage"], ["chainFree", "Chain free"], ["newBuild", "New build"], ["parking", "Parking"]] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 text-[0.9rem] text-ink-2">
                <input type="checkbox" checked={form[key] as boolean} onChange={(e) => update(key, e.target.checked)} className="h-4 w-4 accent-[#284b3a]" />
                {label}
              </label>
            ))}
          </div>

          {error && <p className="mt-4 text-[0.8rem] text-[#a4583f]">{error}</p>}

          <Button type="submit" variant="primary" className="mt-5 w-full" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : mode === "create" ? "Create listing" : "Save changes"}
          </Button>
          <Label className="mt-3 text-center text-muted">
            <button type="button" onClick={() => router.push("/admin/properties")} className="underline">Cancel</button>
          </Label>
        </div>
      </aside>
    </form>
  );
}
