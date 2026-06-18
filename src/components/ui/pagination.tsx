import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  params,
  basePath = "/properties",
}: {
  page: number;
  totalPages: number;
  params: Record<string, string>;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const next: Record<string, string> = { ...params };
    if (p === 1) delete next.page;
    else next.page = String(p);
    const qs = new URLSearchParams(next).toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {page > 1 && (
        <Link href={href(page - 1)} className="px-3 py-2 text-[0.8rem] text-ink-2 hover:text-accent">
          ← Prev
        </Link>
      )}
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center">
            {gap && <span className="px-1 text-muted">…</span>}
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center px-2 text-[0.85rem]",
                p === page ? "bg-ink text-white" : "text-ink-2 hover:bg-surface-2",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < totalPages && (
        <Link href={href(page + 1)} className="px-3 py-2 text-[0.8rem] text-ink-2 hover:text-accent">
          Next →
        </Link>
      )}
    </nav>
  );
}
