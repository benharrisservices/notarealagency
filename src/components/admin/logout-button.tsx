"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white"
    >
      Sign out
    </button>
  );
}
