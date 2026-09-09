import { PrismaClient } from "@prisma/client";
import { ROLE_PERMISSIONS, PERMISSIONS, type RoleKey } from "../src/config/permissions";

const db = new PrismaClient();

const ROLE_NAMES: Record<RoleKey, string> = {
  SUPER_ADMIN: "Super Admin",
  CEO: "CEO / Rahbariyat",
  ACADEMIC_DIRECTOR: "Akademik direktor",
  ADMIN: "Administrator",
  TEACHER: "Oʻqituvchi",
  STUDENT: "Talaba",
  PARENT: "Ota-ona",
};

async function main() {
  // 1) Barcha ruxsatlar
  for (const key of PERMISSIONS) {
    await db.permission.upsert({ where: { key }, create: { key }, update: {} });
  }

  // 2) Rollar + rol->ruxsat bogʻlanishi (config'dan)
  for (const [roleKey, perms] of Object.entries(ROLE_PERMISSIONS) as [RoleKey, any][]) {
    const role = await db.role.upsert({
      where: { key: roleKey as any },
      create: { key: roleKey as any, name: ROLE_NAMES[roleKey] },
      update: { name: ROLE_NAMES[roleKey] },
    });
    const list = perms === "*" ? PERMISSIONS : perms;
    for (const pk of list) {
      const permission = await db.permission.findUnique({ where: { key: pk } });
      if (permission) {
        await db.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          create: { roleId: role.id, permissionId: permission.id },
          update: {},
        });
      }
    }
  }

  // 3) Namuna Super Admin
  await db.user.upsert({
    where: { phone: "+998900000000" },
    update: {},
    create: {
      fullName: "Super Admin",
      phone: "+998900000000",
      passwordHash: "stub:admin123", // TODO: bcrypt hash
      roles: { create: { role: { connect: { key: "SUPER_ADMIN" } } } },
    },
  });

  // 4) Namuna gamifikatsiya nishonlari
  const achievements = [
    { code: "STREAK_7", title: "7 kunlik streak", icon: "🔥", xpReward: 50 },
    { code: "XP_1000", title: "1000 XP toʻplandi", icon: "⭐", xpReward: 0 },
    { code: "FIRST_COURSE", title: "Birinchi kurs tugadi", icon: "🏆", xpReward: 200 },
    { code: "LESSONS_50", title: "50 dars yakunlandi", icon: "🎯", xpReward: 100 },
  ];
  for (const a of achievements) {
    await db.achievement.upsert({ where: { code: a.code }, create: a, update: a });
  }

  console.log("✓ Seed tayyor: rollar, ruxsatlar, super admin, nishonlar.");
}

main().finally(() => db.$disconnect());
