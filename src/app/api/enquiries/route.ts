import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { enquirySchema } from "@/lib/validation";
import { createEnquiry, listEnquiries } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

// POST /api/enquiries — public enquiry / viewing request
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 });

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  await createEnquiry(parsed.data);
  return NextResponse.json({ ok: true }, { status: 201 });
}

// GET /api/enquiries — admin only
export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries });
}
