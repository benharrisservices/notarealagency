import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { LogoutButton } from "./logout-button";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Properties", href: "/admin/properties" },
  { label: "Enquiries", href: "/admin/enquiries" },
];

export function AdminShell({
  children,
  email,
  heading,
  action,
}: {
  children: React.ReactNode;
  email: string;
  heading: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display text-lg uppercase tracking-[0.28em]">
              {siteConfig.wordmark}
            </Link>
            <nav className="hidden gap-6 sm:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-[0.78rem] text-white/70 hover:text-white">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden text-[0.74rem] text-white/50 md:inline">{email}</span>
            <Link href="/" className="text-[0.72rem] text-white/70 hover:text-white">
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl text-ink">{heading}</h1>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
