const BANDS: { letter: string; color: string; text: string; width: string }[] = [
  { letter: "A", color: "#0e7c3f", text: "#fff", width: "42%" },
  { letter: "B", color: "#2c9f4b", text: "#fff", width: "50%" },
  { letter: "C", color: "#8dc63f", text: "#16130f", width: "58%" },
  { letter: "D", color: "#f6d40b", text: "#16130f", width: "66%" },
  { letter: "E", color: "#f7a823", text: "#16130f", width: "74%" },
  { letter: "F", color: "#ef7d22", text: "#fff", width: "82%" },
  { letter: "G", color: "#e52320", text: "#fff", width: "90%" },
];

function Column({ title, rating, score }: { title: string; rating?: string | null; score?: number | null }) {
  return (
    <div>
      <h4 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h4>
      <div className="space-y-1">
        {BANDS.map((b) => {
          const active = rating === b.letter;
          return (
            <div key={b.letter} className="relative flex h-7 items-center" style={{ width: b.width, color: b.text, background: b.color }}>
              <span className="px-2 text-[0.72rem] font-bold">{b.letter}</span>
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+6px)] whitespace-nowrap bg-ink px-2 py-0.5 text-[0.72rem] font-bold text-white">
                  {score ?? ""} · {b.letter}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EpcChart({
  rating,
  score,
  potential,
  potentialScore,
}: {
  rating?: string | null;
  score?: number | null;
  potential?: string | null;
  potentialScore?: number | null;
}) {
  if (!rating && !potential) return null;
  return (
    <div className="grid grid-cols-2 gap-8">
      <Column title="Current" rating={rating} score={score} />
      <Column title="Potential" rating={potential} score={potentialScore} />
    </div>
  );
}
