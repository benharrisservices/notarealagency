"use client";

import { useState } from "react";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ValuationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message || "Could not submit your request.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not submit.");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-accent/30 bg-accent-soft p-6">
        <p className="font-display text-xl text-ink">Thank you — your valuation request is in.</p>
        <p className="mt-2 text-ink-2">One of our advisers will be in touch to arrange a convenient time.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-1">
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label="Name"><Input name="name" required /></Field>
        <Field label="Email"><Input name="email" type="email" required /></Field>
      </div>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label="Telephone"><Input name="phone" type="tel" required /></Field>
        <Field label="Bedrooms"><Input name="bedrooms" type="number" min={0} /></Field>
      </div>
      <Field label="Property address"><Input name="address" required placeholder="Street, area, postcode" /></Field>
      <Field label="Property type">
        <Select name="propertyType" defaultValue="">
          <option value="">Select…</option>
          <option>Apartment / flat</option>
          <option>Terraced house</option>
          <option>Semi-detached house</option>
          <option>Detached house</option>
          <option>Other</option>
        </Select>
      </Field>
      <Field label="Anything else?"><Textarea name="message" placeholder="Sale or lettings valuation, timescales…" /></Field>
      {error && <p className="pb-2 text-[0.8rem] text-[#a4583f]">{error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Submitting…" : "Request valuation"}
      </Button>
    </form>
  );
}
