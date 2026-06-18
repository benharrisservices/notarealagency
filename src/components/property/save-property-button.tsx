"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const KEY = "nara:saved";

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function SavePropertyButton({ slug, className }: { slug: string; className?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(slug));
  }, [slug]);

  const toggle = useCallback(() => {
    const list = readSaved();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
  }, [slug]);

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-2 border px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors",
        saved ? "border-accent text-accent" : "border-line text-ink-2 hover:border-ink",
        className,
      )}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
