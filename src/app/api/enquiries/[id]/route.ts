import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { setEnquiryStatus } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!["NEW", "IN_PROGRESS", "CLOSED"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }
  await setEnquiryStatus(id, status);
  return NextResponse.json({ ok: true });
}
