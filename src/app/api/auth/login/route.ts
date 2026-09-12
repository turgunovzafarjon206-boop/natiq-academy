import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

// Soddalashtirilgan, mustaqil login endpoint (faqat @/lib/db ga bogʻliq).
// Ishlab chiqarishda parolni bcrypt hash bilan tekshiring.
const LoginSchema = z.object({
  phone: z.string().min(7),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = LoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Notoʻgʻri maʼlumot" }, { status: 422 });
  }
  const { phone, password } = parsed.data;

  const user = await db.user.findUnique({ where: { phone } });
  if (!user || user.passwordHash !== `stub:${password}`) {
    return NextResponse.json({ ok: false, error: "Telefon yoki parol notoʻgʻri" }, { status: 401 });
  }

  const token = randomUUID();
  await db.session.create({
    data: { userId: user.id, token, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
  });

  const res = NextResponse.json({ ok: true, data: { id: user.id, fullName: user.fullName } });
  res.cookies.set("zn_session", token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
