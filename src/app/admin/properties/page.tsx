import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/badge";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { formatPrice, PROPERTY_TYPE_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, slug: true, title: true, displayAddress: true, reference: true,
      status: true, propertyType: true, price: true, priceQualifier: true,
      transactionType: true, rentFrequency: true, featured: true,
    },
  });

  return (
    <AdminShell
      email={user.email}
      heading="Properties"
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
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-[0.66rem] uppercase tracking-[0.1em] text-muted">
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-line-2 last:border-0">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="text-[0.8rem] text-muted">{p.displayAddress} · {p.reference}{p.featured ? " · ★ featured" : ""}</p>
                </td>
                <td className="px-5 py-3.5 text-[0.85rem] text-ink-2">{PROPERTY_TYPE_LABEL[p.propertyType]}</td>
                <td className="px-5 py-3.5 text-[0.85rem] text-ink-2">{formatPrice(p)}</td>
                <td className="px-5 py-3.5"><StatusBadge status={p.status} />{p.status === "AVAILABLE" && <span className="text-[0.8rem] text-muted">Available</span>}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/properties/${p.slug}`} className="text-[0.78rem] font-medium text-ink-2 hover:text-accent">View</Link>
                    <Link href={`/admin/properties/${p.id}/edit`} className="text-[0.78rem] font-medium text-accent hover:underline">Edit</Link>
                    <DeletePropertyButton id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No properties yet. Create your first listing.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
