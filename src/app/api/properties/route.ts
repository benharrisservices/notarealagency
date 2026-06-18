import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { propertyInputSchema } from "@/lib/validation";
import { parsePropertyFilters, searchProperties, propertyCardSelect } from "@/lib/properties";

export const dynamic = "force-dynamic";

// GET /api/properties — filtered list, or ?slugs=a,b,c for saved properties
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slugsParam = searchParams.get("slugs");
  if (slugsParam) {
    const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 60);
    const found = await prisma.property.findMany({ where: { slug: { in: slugs } }, select: propertyCardSelect });
    // Preserve the order the slugs were saved in.
    const ordered = slugs.map((s) => found.find((p) => p.slug === s)).filter(Boolean);
    return NextResponse.json({ properties: ordered });
  }

  const filters = parsePropertyFilters(Object.fromEntries(searchParams.entries()));
  const result = await searchProperties(filters);
  return NextResponse.json(result);
}

// POST /api/properties — create a listing (admin only)
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid request body" }, { status: 400 });

  const parsed = propertyInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const d = parsed.data;
  const images: string[] = Array.isArray(body.images) ? body.images : [];
  const floorplanUrl: string | undefined = typeof body.floorplanUrl === "string" ? body.floorplanUrl : undefined;

  try {
    const created = await prisma.property.create({
      data: {
        ...d,
        publishedAt: d.status === "AVAILABLE" ? new Date() : null,
        images: images.length
          ? { create: images.map((url, i) => ({ url, sortOrder: i, isPrimary: i === 0 })) }
          : undefined,
        documents: floorplanUrl ? { create: [{ type: "FLOORPLAN", title: "Floorplan", url: floorplanUrl }] } : undefined,
      } as Prisma.PropertyUncheckedCreateInput,
    });
    return NextResponse.json({ property: created }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ message: "A property with that slug or reference already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Could not create the property." }, { status: 500 });
  }
}
