"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      alert("Could not delete the property.");
      setBusy(false);
    }
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-[0.78rem] font-medium text-[#a4583f] hover:underline disabled:opacity-50">
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
