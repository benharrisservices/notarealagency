import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { verifyPassword, startSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/auth/login
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter your email and password." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const ok = user && (await verifyPassword(parsed.data.password, user.passwordHash));
  if (!user || !ok) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  await startSession({ sub: user.id, email: user.email, role: user.role });
  return NextResponse.json({ ok: true });
}
