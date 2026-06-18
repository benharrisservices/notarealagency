import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white border border-ink hover:bg-accent hover:border-accent",
  accent: "bg-accent text-white border border-accent hover:bg-accent-2 hover:border-accent-2",
  outline: "bg-transparent text-ink border border-line hover:border-ink",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-surface-2",
  light: "bg-white text-ink border border-white hover:bg-surface-2",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.72rem]",
  md: "px-6 py-3 text-[0.74rem]",
  lg: "px-8 py-4 text-[0.8rem]",
};

const base =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.14em] transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {props.children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  );
}
