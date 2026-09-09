import { db } from "@/lib/db";
import { ok, notFound, handler } from "@/lib/api";

// GET /api/certificates/verify/NAT-2026-000123  — OCHIQ (auth talab qilinmaydi)
// QR kod shu endpoint'ga / /certificate/:publicId sahifasiga olib boradi.
export const GET = handler(async (_req, { params }: { params: { publicId: string } }) => {
  const cert = await db.certificate.findUnique({
    where: { publicId: params.publicId },
    include: {
      course: { select: { title: true } },
      student: { include: { user: { select: { fullName: true } } } },
    },
  });
  if (!cert) return notFound("Sertifikat");

  // Faqat ommaviy tekshiruv uchun zarur, minimal maʼlumot qaytariladi.
  return ok({
    valid: true,
    publicId: cert.publicId,
    studentName: cert.student.user.fullName,
    course: cert.course.title,
    level: cert.level,
    issuedAt: cert.issuedAt,
  });
});
