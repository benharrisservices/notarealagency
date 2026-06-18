import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { PropertyForm } from "@/components/admin/property-form";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return (
    <AdminShell email={user.email} heading="New listing">
      <PropertyForm mode="create" />
    </AdminShell>
  );
}
