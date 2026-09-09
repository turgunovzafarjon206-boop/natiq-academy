// ============================================================================
//  RBAC — nozik (granular) ruxsatlar va rol -> ruxsat xaritasi.
//  Ruxsatlar konfiguratsiyalanadi: yangi rol/ruxsat qoʻshish uchun faqat shu
//  faylni (va DB seed'ni) oʻzgartirish kifoya, kod mantigʻiga tegilmaydi.
//  Siyosat: "deny by default" — ruxsat aniq berilmasa, rad etiladi.
// ============================================================================

export const PERMISSIONS = [
  // students
  "student.view", "student.create", "student.edit", "student.delete",
  "student.viewOwnGroup", "student.viewOwnChild",
  // teachers
  "teacher.view", "teacher.create", "teacher.edit", "teacher.delete",
  // courses / content
  "course.view", "course.create", "course.edit", "course.delete", "course.publish",
  "lesson.manage", "material.manage",
  // learning (student side)
  "learning.access", "lesson.progress", "quiz.attempt", "homework.submit",
  // homework grading
  "homework.view", "homework.grade",
  // attendance
  "attendance.view", "attendance.mark",
  // payments
  "payment.view", "payment.viewOwn", "payment.create", "payment.edit",
  // certificates
  "certificate.view", "certificate.issue",
  // notifications / announcements
  "notification.view", "announcement.send",
  // analytics
  "analytics.view", "analytics.viewAcademic", "analytics.viewOperational", "analytics.viewOwnClass",
  // crm
  "crm.view", "crm.manage",
  // system
  "rbac.manage", "audit.view", "settings.manage", "branding.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type RoleKey =
  | "SUPER_ADMIN" | "CEO" | "ACADEMIC_DIRECTOR" | "ADMIN"
  | "TEACHER" | "STUDENT" | "PARENT";

// "*" — barcha ruxsatlar (Super Admin)
export const ROLE_PERMISSIONS: Record<RoleKey, Permission[] | "*"> = {
  SUPER_ADMIN: "*",

  CEO: [
    "student.view", "teacher.view", "payment.view", "certificate.view",
    "analytics.view", "announcement.send", "audit.view", "crm.view",
  ],

  ACADEMIC_DIRECTOR: [
    "student.view", "student.create", "student.edit",
    "teacher.view", "teacher.create", "teacher.edit",
    "course.view", "course.create", "course.edit", "course.publish",
    "lesson.manage", "material.manage",
    "homework.view", "attendance.view", "certificate.view", "certificate.issue",
    "analytics.viewAcademic", "announcement.send", "notification.view",
  ],

  ADMIN: [
    "student.view", "student.create", "student.edit",
    "teacher.view", "course.view", "course.edit",
    "payment.view", "payment.create", "payment.edit",
    "attendance.view", "certificate.view",
    "analytics.viewOperational", "announcement.send", "notification.view",
    "crm.view", "crm.manage",
  ],

  TEACHER: [
    "student.viewOwnGroup", "course.view", "course.edit",
    "lesson.manage", "material.manage",
    "homework.view", "homework.grade",
    "attendance.view", "attendance.mark",
    "analytics.viewOwnClass", "notification.view", "announcement.send",
  ],

  STUDENT: [
    "learning.access", "lesson.progress", "quiz.attempt", "homework.submit",
    "payment.viewOwn", "certificate.view", "notification.view",
  ],

  PARENT: [
    "student.viewOwnChild", "payment.viewOwn", "certificate.view", "notification.view",
  ],
};

/** Foydalanuvchi rollari asosida ruxsat borligini tekshiradi. */
export function can(roles: RoleKey[], permission: Permission): boolean {
  for (const role of roles) {
    const perms = ROLE_PERMISSIONS[role];
    if (perms === "*") return true;
    if (perms?.includes(permission)) return true;
  }
  return false; // deny by default
}
