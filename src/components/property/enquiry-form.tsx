"use client";

import { useState } from "react";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type EnquiryType = "VIEWING" | "SALES" | "VALUATION" | "LETTINGS" | "CALLBACK" | "GENERAL";

export function EnquiryForm({
  propertyId,
  defaultType = "VIEWING",
  showTypeSelect = false,
  submitLabel = "Send enquiry",
}: {
  propertyId?: string;
  defaultType?: EnquiryType;
  showTypeSelect?: boolean;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      type: (form.get("type") as string) || defaultType,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      propertyId,
    };
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-accent/30 bg-accent-soft p-6">
        <p className="font-display text-xl text-ink">Thank you — your enquiry has been sent.</p>
        <p className="mt-2 text-[0.95rem] text-ink-2">
          A member of the team will be in touch shortly to help with your request.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-1">
      {showTypeSelect && (
        <Field label="Nature of enquiry">
          <Select name="type" defaultValue={defaultType}>
            <option value="VIEWING">Book a viewing</option>
            <option value="SALES">Sales enquiry</option>
            <option value="VALUATION">Request a valuation</option>
            <option value="LETTINGS">Lettings enquiry</option>
            <option value="GENERAL">General enquiry</option>
          </Select>
        </Field>
      )}
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label="Name"><Input name="name" required autoComplete="name" /></Field>
        <Field label="Email"><Input name="email" type="email" required autoComplete="email" /></Field>
      </div>
      <Field label="Telephone"><Input name="phone" type="tel" autoComplete="tel" /></Field>
      <Field label="Message">
        <Textarea name="message" required placeholder="Let us know how we can help…" />
      </Field>
      {error && <p className="pb-2 text-[0.8rem] text-[#a4583f]">{error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
