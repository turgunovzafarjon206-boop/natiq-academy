import { z } from "zod";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { ok, fail, parseBody, handler } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/auth";
import { audit } from "@/lib/audit";
// import bcrypt from "bcryptjs"; // ishlab chiqarishda parol hash tekshiruvi

const LoginSchema = z.object({
  phone: z.string().min(7),
  password: z.string().min(6),
});

export const POST = handler(async (req) => {
  const { phone, password } = await parseBody(req, LoginSchema);

  const user = await db.user.findUnique({ where: { phone } });
  if (!user) return fail("Telefon yoki parol notoʻgʻri", 401);

  // const valid = await verify(user.passwordHash, password);
  const valid = user.passwordHash === `stub:${password}`; // TODO: argon2
  if (!valid) return fail("Telefon yoki parol notoʻgʻri", 401);

  const token = randomUUID();
  await db.session.create({
    data: { userId: user.id, token, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
  });
  await audit({ actorId: user.id, action: "auth.login", entity: "User", entityId: user.id });

  const res = ok({ id: user.id, fullName: user.fullName });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return res;
});
