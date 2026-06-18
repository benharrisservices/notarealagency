import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { siteConfig } from "@/lib/site";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl uppercase tracking-[0.3em] text-ink">{siteConfig.wordmark}</span>
          <p className="mt-2 text-[0.8rem] uppercase tracking-[0.14em] text-muted">Admin dashboard</p>
        </div>
        <div className="border border-line bg-white p-7">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-[0.74rem] text-muted">
          Seed credentials are set in your <code>.env</code> file.
        </p>
      </div>
    </div>
  );
}
