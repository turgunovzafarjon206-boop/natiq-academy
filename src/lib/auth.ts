import { cookies } from "next/headers";
import { db } from "./db";
import { ApiError } from "./api";
import { can, type Permission, type RoleKey } from "@/config/permissions";

// ============================================================================
//  Autentifikatsiya + RBAC yordamchilari.
//  Bu skelet oddiy DB session token'idan foydalanadi; ishlab chiqarishda
//  Auth.js / JWT ga almashtirilishi yoki kengaytirilishi mumkin.
// ============================================================================

export type SessionUser = {
  id: string;
  fullName: string;
  roles: RoleKey[];
};

const COOKIE = "zn_session";

/** Joriy foydalanuvchini session cookie'dan oʻqiydi (yoki null). */
export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: { include: { roles: { include: { role: true } } } } },
  });
  if (!session || session.expiresAt < new Date()) return null;

  return {
    id: session.user.id,
    fullName: session.user.fullName,
    roles: session.user.roles.map((r) => r.role.key as RoleKey),
  };
}

/** Login talab qiladi; boʻlmasa 401. */
export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new ApiError("Avtorizatsiya talab qilinadi", 401);
  return user;
}

/** Muayyan ruxsatni talab qiladi; boʻlmasa 403 (deny by default). */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user.roles, permission)) {
    throw new ApiError("Ushbu amal uchun ruxsatingiz yoʻq", 403);
  }
  return user;
}

export { COOKIE as SESSION_COOKIE };
