// ============================================================================
//  Toʻlov provayderi ABSTRAKSIYASI.
//  Hech qanday provayder qat'iy kodlanmagan. Click / Payme / Uzum keyin
//  shu interfeysni implement qilgan holda qoʻshiladi — biznes-mantiq oʻzgarmaydi.
// ============================================================================

export type CheckoutParams = {
  paymentId: string;
  amount: number;      // soʻm
  returnUrl: string;
  description?: string;
};

export type CheckoutResult = {
  redirectUrl: string; // provayder checkout sahifasi
  providerRef?: string;
};

export type WebhookResult = {
  paymentId: string;
  providerTxnId: string;
  status: "PAID" | "FAILED";
};

export interface PaymentProviderAdapter {
  readonly key: "MANUAL" | "CLICK" | "PAYME" | "UZUM";
  /** Checkout URL yaratadi. */
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  /** Kelgan webhook'ni tekshiradi va normalizatsiya qiladi (idempotent). */
  verifyWebhook(req: Request): Promise<WebhookResult>;
}

// ---- Registry: yangi provayderni shu yerga registratsiya qiling ----
const registry = new Map<string, PaymentProviderAdapter>();

export function registerProvider(adapter: PaymentProviderAdapter) {
  registry.set(adapter.key, adapter);
}

export function getProvider(key: string): PaymentProviderAdapter {
  const p = registry.get(key.toUpperCase());
  if (!p) throw new Error(`Toʻlov provayderi topilmadi yoki ulanmagan: ${key}`);
  return p;
}

// ---- Namuna: MANUAL provayder (admin qoʻlda tasdiqlaydi) ----
class ManualProvider implements PaymentProviderAdapter {
  readonly key = "MANUAL" as const;
  async createCheckout(p: CheckoutParams): Promise<CheckoutResult> {
    return { redirectUrl: `${p.returnUrl}?manual=1&payment=${p.paymentId}` };
  }
  async verifyWebhook(): Promise<WebhookResult> {
    throw new Error("MANUAL provayder webhook ishlatmaydi");
  }
}
registerProvider(new ManualProvider());

// TODO: registerProvider(new ClickProvider())  — src/modules/payments/providers/click.ts
// TODO: registerProvider(new PaymeProvider())  — src/modules/payments/providers/payme.ts
// TODO: registerProvider(new UzumProvider())   — src/modules/payments/providers/uzum.ts
