import { db } from "@/lib/db";
import { ok, handler, ApiError } from "@/lib/api";
import { getProvider } from "@/modules/payments/provider";
import { audit } from "@/lib/audit";

// POST /api/payments/webhook/click  (yoki payme / uzum)
// Idempotent: bir tranzaksiya faqat bir marta qayta ishlanadi (providerTxnId unique).
export const POST = handler(async (req, { params }: { params: { provider: string } }) => {
  const provider = getProvider(params.provider);
  const result = await provider.verifyWebhook(req);

  const payment = await db.payment.findUnique({ where: { id: result.paymentId } });
  if (!payment) throw new ApiError("Toʻlov topilmadi", 404);

  // Idempotency guard
  if (payment.providerTxnId === result.providerTxnId && payment.status === "PAID") {
    return ok({ alreadyProcessed: true });
  }

  const updated = await db.payment.update({
    where: { id: payment.id },
    data: {
      providerTxnId: result.providerTxnId,
      status: result.status === "PAID" ? "PAID" : "PENDING",
      paidAt: result.status === "PAID" ? new Date() : null,
    },
  });

  await audit({
    action: "payment.webhook",
    entity: "Payment",
    entityId: payment.id,
    meta: { provider: provider.key, status: result.status },
  });

  // TODO: kirishni ochish + Telegram/Email bildirishnoma + kvitansiya.
  return ok({ status: updated.status });
});
