"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/field";

const OPTIONS: [string, string][] = [
  ["newest", "Newest first"],
  ["price_asc", "Price (low to high)"],
  ["price_desc", "Price (high to low)"],
  ["beds_desc", "Most bedrooms"],
];

export function SortSelect({ value, params }: { value: string; params: Record<string, string> }) {
  const router = useRouter();
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next: Record<string, string> = { ...params, sort: e.target.value };
    delete next.page;
    router.push(`/properties?${new URLSearchParams(next).toString()}`);
  }
  return (
    <Select value={value} onChange={onChange} className="w-auto py-2 text-[0.85rem]">
      {OPTIONS.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </Select>
  );
}
