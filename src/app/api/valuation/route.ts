import { NextResponse } from "next/server";
import { valuationSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/valuation — public valuation request (stored as a VALUATION enquiry)
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 });

  const parsed = valuationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const d = parsed.data;
  const message = [
    `Valuation request for: ${d.address}`,
    d.propertyType ? `Property type: ${d.propertyType}` : null,
    d.bedrooms !== undefined ? `Bedrooms: ${d.bedrooms}` : null,
    d.message ? `Notes: ${d.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await prisma.enquiry.create({
    data: { type: "VALUATION", name: d.name, email: d.email, phone: d.phone || null, message },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
