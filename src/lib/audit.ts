import { db } from "./db";

/**
 * Audit log — barcha admin/oʻzgartiruvchi amallar oʻzgarmas jurnalga yoziladi.
 * Kim, nima, qaysi obyektga, qachon.
 */
export async function audit(params: {
  actorId?: string | null;
  action: string;         // "student.create"
  entity?: string;        // "Student"
  entityId?: string;
  meta?: Record<string, unknown>;
  ip?: string;
}) {
  await db.auditLog.create({
    data: {
      actorId: params.actorId ?? null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      meta: params.meta as any,
      ip: params.ip,
    },
  });
}
