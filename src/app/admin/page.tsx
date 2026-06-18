import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [total, available, underOffer, lettings, newEnquiries, recent] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "AVAILABLE" } }),
    prisma.property.count({ where: { status: "UNDER_OFFER" } }),
    prisma.property.count({ where: { transactionType: "LETTING" } }),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { property: { select: { title: true } } } }),
  ]);

  const stats = [
    ["Total listings", total],
    ["Available", available],
    ["Under offer", underOffer],
    ["To let", lettings],
    ["New enquiries", newEnquiries],
  ] as const;

  return (
    <AdminShell
      email={user.email}
      heading="Dashboard"
      action={
        <div className="flex gap-2">
          <Link
            href="/admin/properties/import"
            className="border border-line px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink hover:border-ink"
          >
            Import listing
          </Link>
          <Link href="/admin/properties/new" className="bg-ink px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white hover:bg-accent">
            New listing
          </Link>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="border border-line bg-white p-5">
            <p className="font-display text-4xl text-ink">{value}</p>
            <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display text-xl text-ink">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-accent">View all</Link>
          </div>
          <ul>
            {recent.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-4 border-b border-line-2 px-6 py-3.5 last:border-0">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{e.name} · <span className="font-normal text-muted">{e.type.replace("_", " ").toLowerCase()}</span></p>
                  <p className="truncate text-[0.82rem] text-muted">{e.property?.title ?? "General enquiry"}</p>
                </div>
                <span className="shrink-0 text-[0.74rem] text-muted">{formatDate(e.createdAt)}</span>
              </li>
            ))}
            {recent.length === 0 && <li className="px-6 py-6 text-muted">No enquiries yet.</li>}
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/admin/properties" className="block border border-line bg-white p-5 hover:border-ink">
            <p className="font-display text-lg text-ink">Manage properties</p>
            <p className="text-[0.82rem] text-muted">Create, edit and remove listings.</p>
          </Link>
          <Link href="/admin/enquiries" className="block border border-line bg-white p-5 hover:border-ink">
            <p className="font-display text-lg text-ink">Enquiries</p>
            <p className="text-[0.82rem] text-muted">Track and update enquiry status.</p>
          </Link>
          <Link href="/" className="block border border-line bg-surface p-5 hover:border-ink">
            <p className="font-display text-lg text-ink">View live site →</p>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
