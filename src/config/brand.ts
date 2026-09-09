// ============================================================================
//  Brend konfiguratsiyasi — nom, logo, ranglar bir joyda.
//  Yangi akademiyaga moslashtirish uchun faqat shu faylni (va i18n matnlarini)
//  oʻzgartiring; kodning qolgan qismiga tegmasdan "white-label" qilinadi.
// ============================================================================

export const BRAND = {
  name: "Natiq Academy",
  shortName: "Natiq Academy",
  tagline: "Ilm olishning zamonaviy usuli",
  logo: "/logo.svg",
  certificatePrefix: "NAT", // NAT-2026-000123
  defaultLocale: "uz" as const,
  locales: ["uz", "ru", "en", "ar"] as const,
  rtlLocales: ["ar"] as const,
  contact: {
    phone: "+998 71 000 00 00",
    email: "info@natiqacademy.uz",
    address: "Toshkent, Oʻzbekiston",
  },
  colors: {
    brand: "#0E6F63",
    brandInk: "#0A544B",
    gold: "#B5842A",
    success: "#2E8B62",
    warning: "#B7791F",
    danger: "#C0503F",
    ground: "#F6F4EF",
    ink: "#1A211F",
  },
  fonts: {
    display: "Bricolage Grotesque",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
  },
} as const;

export type BrandLocale = (typeof BRAND.locales)[number];
