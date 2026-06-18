import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listEnquiries } from "@/lib/enquiries";
import { AdminShell } from "@/components/admin/admin-shell";
import { EnquiryStatusSelect } from "@/components/admin/enquiry-status-select";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const enquiries = await listEnquiries();

  return (
    <AdminShell email={user.email} heading="Enquiries">
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-[0.66rem] uppercase tracking-[0.1em] text-muted">
              <th className="px-5 py-3 font-semibold">From</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Message</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-line-2 align-top last:border-0">
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{e.name}</p>
                  <a href={`mailto:${e.email}`} className="block text-[0.8rem] text-accent">{e.email}</a>
                  {e.phone && <p className="text-[0.8rem] text-muted">{e.phone}</p>}
                </td>
                <td className="px-5 py-4 text-[0.82rem] text-ink-2">{e.type.replace("_", " ").toLowerCase()}</td>
                <td className="px-5 py-4 text-[0.82rem] text-ink-2">{e.property?.title ?? "—"}</td>
                <td className="max-w-xs px-5 py-4 text-[0.82rem] text-muted"><p className="line-clamp-3 whitespace-pre-line">{e.message}</p></td>
                <td className="px-5 py-4 text-[0.8rem] text-muted">{formatDate(e.createdAt)}</td>
                <td className="px-5 py-4"><EnquiryStatusSelect id={e.id} status={e.status} /></td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No enquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
