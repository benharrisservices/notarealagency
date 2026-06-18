export function PropertyFeatures({ features }: { features: string[] }) {
  if (!features.length) return null;
  return (
    <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-3 border-b border-line-2 py-2.5">
          <svg
            className="mt-0.5 shrink-0 text-accent"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8.5 6.5 12 13 4" />
          </svg>
          <span className="text-[0.95rem] text-ink-2">{f}</span>
        </li>
      ))}
    </ul>
  );
}
