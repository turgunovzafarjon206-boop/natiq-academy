import { ok, handler, fail } from "@/lib/api";
import { handleUpdate } from "@/server/telegram/bot";

// POST /api/telegram/webhook  — Telegram Bot API webhook.
// Xavfsizlik: secret token header tekshiruvi (setWebhook'da belgilanadi).
export const POST = handler(async (req) => {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) return fail("Ruxsat yoʻq", 401);

  const update = await req.json().catch(() => null);
  if (update) await handleUpdate(update);
  return ok({ received: true });
});
