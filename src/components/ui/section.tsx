import { cn } from "@/lib/utils";
import { Container } from "./container";

export function Section({
  className,
  surface,
  children,
  id,
}: {
  className?: string;
  surface?: boolean;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", surface && "bg-surface", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block text-[0.7rem] font-semibold uppercase tracking-label text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl leading-tight sm:text-[2.6rem]">{title}</h2>
      {intro && <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
