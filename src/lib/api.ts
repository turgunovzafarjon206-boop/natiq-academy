import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

// ============================================================================
//  Izchil API javob qobigʻi: { ok, data, error, meta }
//  Barcha endpointlar shu helperlardan foydalanadi.
// ============================================================================

export type ApiMeta = { page?: number; pageSize?: number; total?: number; totalPages?: number };

export function ok<T>(data: T, meta?: ApiMeta) {
  return NextResponse.json({ ok: true, data, error: null, meta: meta ?? null });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { ok: false, data: null, error: { message, details: details ?? null } },
    { status }
  );
}

export const unauthorized = () => fail("Avtorizatsiya talab qilinadi", 401);
export const forbidden = () => fail("Ushbu amal uchun ruxsatingiz yoʻq", 403);
export const notFound = (what = "Resurs") => fail(`${what} topilmadi`, 404);

/** Zod bilan validatsiya; xato boʻlsa 422 qaytaradi. */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  const json = await req.json().catch(() => ({}));
  try {
    return schema.parse(json);
  } catch (e) {
    if (e instanceof ZodError) {
      throw new ApiError("Kiritilgan maʼlumot notoʻgʻri", 422, e.flatten());
    }
    throw e;
  }
}

export class ApiError extends Error {
  constructor(message: string, public status = 400, public details?: unknown) {
    super(message);
  }
}

/** Route handler'larni oʻrab, ApiError'ni izchil javobga aylantiradi. */
export function handler(fn: (req: Request, ctx: any) => Promise<Response>) {
  return async (req: Request, ctx: any) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof ApiError) return fail(e.message, e.status, e.details);
      console.error(e);
      return fail("Ichki xatolik yuz berdi", 500);
    }
  };
}

/** Sahifalash parametrlarini oʻqiydi (search/filter/sort/paginate). */
export function pagination(url: string) {
  const u = new URL(url);
  const page = Math.max(1, Number(u.searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(u.searchParams.get("pageSize") ?? 20)));
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
    q: u.searchParams.get("q")?.trim() ?? "",
    sort: u.searchParams.get("sort") ?? "createdAt",
    order: (u.searchParams.get("order") === "asc" ? "asc" : "desc") as "asc" | "desc",
    filter: Object.fromEntries(u.searchParams.entries()),
  };
}
