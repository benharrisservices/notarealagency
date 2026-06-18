import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/lib/format";

export function Badge({
  children,
  className,
  tone = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "accent" | "muted" | "light";
}) {
  const tones = {
    ink: "bg-ink text-white",
    accent: "bg-accent text-white",
    muted: "bg-surface-2 text-ink-2",
    light: "bg-white/90 text-ink",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center text-[0.6rem] font-semibold uppercase tracking-[0.16em] px-2.5 py-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "UNDER_OFFER" || status === "LET_AGREED" ? "accent" : "ink";
  if (status === "AVAILABLE") return null;
  return <Badge tone={tone}>{STATUS_LABEL[status] ?? status}</Badge>;
}
