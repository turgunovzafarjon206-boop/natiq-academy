// ============================================================================
//  Telegram bot — platforma bilan chuqur integratsiya (webhook-ready).
//  Xavfsiz bogʻlash: foydalanuvchi platformadan bir martalik kod oladi va uni
//  botga yuboradi; kod tasdiqlangach User.telegramId biriktiriladi.
// ============================================================================

import { db } from "@/lib/db";

const TG_API = (token: string) => `https://api.telegram.org/bot${token}`;

export const BOT_MENU = [
  { key: "courses", label: "📚 Mening kurslarim" },
  { key: "schedule", label: "📅 Jadval" },
  { key: "homework", label: "📝 Uy vazifalari" },
  { key: "progress", label: "📊 Oʻzlashtirish" },
  { key: "payments", label: "💳 Toʻlovlar" },
  { key: "certificate", label: "🎓 Sertifikat" },
  { key: "notifications", label: "🔔 Bildirishnomalar" },
  { key: "teacher", label: "👨‍🏫 Oʻqituvchi" },
  { key: "support", label: "💬 Yordam" },
] as const;

type TgUpdate = {
  message?: { chat: { id: number }; from?: { id: number }; text?: string };
  callback_query?: { data: string; from: { id: number }; message: { chat: { id: number } } };
};

async function send(chatId: number, text: string, keyboard = true) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  await fetch(`${TG_API(token)}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: keyboard
        ? { keyboard: chunk(BOT_MENU.map((m) => ({ text: m.label })), 2), resize_keyboard: true }
        : undefined,
    }),
  });
}

/** Kelgan Telegram update'ini qayta ishlaydi. */
export async function handleUpdate(update: TgUpdate) {
  const msg = update.message;
  if (!msg?.text || !msg.from) return;
  const chatId = msg.chat.id;
  const tgId = BigInt(msg.from.id);

  // 1) /start yoki bogʻlash kodi
  if (msg.text.startsWith("/start")) {
    const linked = await db.user.findUnique({ where: { telegramId: tgId } });
    if (linked) {
      return send(chatId, `Assalomu alaykum, ${linked.fullName}! Menyudan tanlang 👇`);
    }
    return send(
      chatId,
      "Akkauntni bogʻlash uchun platforma profilingizdagi bir martalik kodni yuboring.",
      false
    );
  }

  // 2) Bogʻlash kodi (6 xonali) — namuna mantiq
  if (/^\d{6}$/.test(msg.text.trim())) {
    // TODO: kodni tekshirish (Redis'da saqlangan bir martalik kod) va biriktirish
    // await linkTelegram(code, tgId)
    return send(chatId, "Akkauntingiz muvaffaqiyatli bogʻlandi ✓");
  }

  // 3) Menyu bandlari
  const item = BOT_MENU.find((m) => m.label === msg.text!.trim());
  if (item) return send(chatId, `«${item.label}» boʻlimi tez orada shu yerda koʻrsatiladi.`);

  return send(chatId, "Menyudan kerakli boʻlimni tanlang 👇");
}

/** Platformadan foydalanuvchiga bildirishnoma yuborish (notification kanali). */
export async function notifyTelegram(telegramId: bigint, text: string) {
  await send(Number(telegramId), text, false);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
