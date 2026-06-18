"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { PropertyGrid } from "@/components/property/property-grid";
import type { PropertyCard } from "@/lib/properties";

export default function SavedPage() {
  const [items, setItems] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let slugs: string[] = [];
    try {
      slugs = JSON.parse(localStorage.getItem("nara:saved") || "[]");
    } catch {
      slugs = [];
    }
    if (slugs.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/properties?slugs=${encodeURIComponent(slugs.join(","))}`)
      .then((r) => r.json())
      .then((d) => setItems(d.properties ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-14">
      <Eyebrow className="mb-3">Saved</Eyebrow>
      <h1 className="font-display text-4xl text-ink sm:text-5xl">Your saved properties</h1>
      <p className="mt-3 text-muted">Saved on this device. Clear your browser data and they will be removed.</p>

      <div className="mt-12">
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-line bg-surface py-20 text-center">
            <p className="font-display text-2xl text-ink">You have not saved any properties yet</p>
            <p className="mt-2 text-muted">Tap “Save” on any listing to keep it here.</p>
            <Link href="/properties" className="mt-5 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-accent">Browse properties →</Link>
          </div>
        ) : (
          <PropertyGrid properties={items} />
        )}
      </div>
    </Container>
  );
}
