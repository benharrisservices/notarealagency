import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImportListing } from "@/components/admin/import-listing";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ImportListingPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      email={user.email}
      heading="Import listing"
      action={
        <Link
          href="/admin/properties/new"
          className="border border-line px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink hover:border-ink"
        >
          Manual entry
        </Link>
      }
    >
      <p className="mb-6 max-w-2xl text-[0.9rem] leading-relaxed text-muted">
        Upload an estate-agent brochure or property particulars PDF to create a draft listing quickly.
        Extraction is a starting point, not a substitute for review.
      </p>
      <ImportListing />
    </AdminShell>
  );
}
