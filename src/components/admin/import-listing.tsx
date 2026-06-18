"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ImportListing() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit() {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Import failed.");
      router.push(data.editUrl || `/admin/properties/${data.id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed.");
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="border border-line bg-white p-6">
        <label
          htmlFor="pdf"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line-2 bg-surface px-6 py-12 text-center transition-colors hover:border-ink"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-ink-2">
            <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="font-display text-lg text-ink">
            {file ? file.name : "Choose a PDF brochure"}
          </span>
          <span className="text-[0.8rem] text-muted">
            Property particulars or brochure — PDF, up to ~10MB
          </span>
        </label>
        <input
          id="pdf"
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            setError(null);
            setFile(e.target.files?.[0] ?? null);
          }}
        />

        {error && <p className="mt-4 text-[0.85rem] text-red-700">{error}</p>}

        <button
          onClick={submit}
          disabled={!file || busy}
          className="mt-6 w-full bg-ink px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Reading PDF & creating draft…" : "Import & review"}
        </button>
      </div>

      <p className="mt-4 text-[0.82rem] leading-relaxed text-muted">
        We extract what we can — title, address, price, bedrooms, bathrooms, tenure, EPC, floor area and
        key features — and create a <strong className="text-ink-2">draft</strong> listing. You&rsquo;ll land
        in the editor to review and correct every field before publishing. Nothing goes live automatically.
      </p>
    </div>
  );
}
