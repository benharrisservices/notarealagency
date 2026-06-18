import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { propertyInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) return null;
  return user;
}

// GET /api/properties/:id
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, documents: true, agent: true, location: true },
  });
  if (!property) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ property });
}

// PUT /api/properties/:id — update (admin)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 });

  const parsed = propertyInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const d = parsed.data;
  const images: string[] | undefined = Array.isArray(body.images) ? body.images : undefined;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (images) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });
      }
      return tx.property.update({
        where: { id },
        data: {
          ...d,
          ...(images
            ? { images: { create: images.map((url, i) => ({ url, sortOrder: i, isPrimary: i === 0 })) } }
            : {}),
        } as Prisma.PropertyUncheckedUpdateInput,
      });
    });
    return NextResponse.json({ property: updated });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") return NextResponse.json({ message: "Slug or reference already in use." }, { status: 409 });
      if (err.code === "P2025") return NextResponse.json({ message: "Property not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Could not update the property." }, { status: 500 });
  }
}

// DELETE /api/properties/:id — delete (admin)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Could not delete the property." }, { status: 500 });
  }
}
