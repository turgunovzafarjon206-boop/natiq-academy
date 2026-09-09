import { z } from "zod";
import { db } from "@/lib/db";
import { ok, parseBody, pagination, handler } from "@/lib/api";
import { requirePermission } from "@/lib/auth";
import { audit } from "@/lib/audit";
import type { Prisma } from "@prisma/client";

// GET /api/students?q=&page=&pageSize=&sort=&order=  — qidiruv + filtr + saralash + sahifalash
export const GET = handler(async (req) => {
  await requirePermission("student.view");
  const { skip, take, page, pageSize, q, sort, order } = pagination(req.url);

  const where: Prisma.StudentWhereInput = q
    ? {
        OR: [
          { studentCode: { contains: q, mode: "insensitive" } },
          { user: { fullName: { contains: q, mode: "insensitive" } } },
          { user: { phone: { contains: q } } },
        ],
      }
    : {};

  const [rows, total] = await Promise.all([
    db.student.findMany({
      where, skip, take,
      orderBy: { [sort === "name" ? "createdAt" : sort]: order },
      include: { user: { select: { fullName: true, phone: true, status: true } } },
    }),
    db.student.count({ where }),
  ]);

  return ok(rows, { page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
});

// POST /api/students — yangi talaba (ruxsat: student.create)
const CreateStudentSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  branchId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
});

export const POST = handler(async (req) => {
  const actor = await requirePermission("student.create");
  const input = await parseBody(req, CreateStudentSchema);

  const year = new Date().getFullYear();
  const count = await db.student.count();
  const studentCode = `NAT-${year}-${String(count + 1).padStart(6, "0")}`;

  const student = await db.student.create({
    data: {
      studentCode,
      branchId: input.branchId,
      user: {
        create: {
          fullName: input.fullName,
          phone: input.phone,
          passwordHash: "stub:changeme", // TODO: taklifnoma / SMS orqali parol
          roles: { create: { role: { connect: { key: "STUDENT" } } } },
        },
      },
    },
    include: { user: true },
  });

  await audit({ actorId: actor.id, action: "student.create", entity: "Student", entityId: student.id });
  return ok(student);
});
