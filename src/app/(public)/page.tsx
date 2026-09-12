import { BRAND } from "@/config/brand";

// Ommaviy bosh sahifa (SSR — SEO uchun). To'liq marketing sektsiyalari
// (Hero, Kurslar, Ustozlar, Natijalar, FAQ, CTA) shu sahifada quriladi.
export default function HomePage() {
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px", fontFamily: "system-ui" }}>
      <p style={{ letterSpacing: ".14em", textTransform: "uppercase", color: BRAND.colors.brand, fontSize: 12 }}>
        Zamonaviy taʼlim akademiyasi
      </p>
      <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: "12px 0" }}>{BRAND.tagline}</h1>
      <p style={{ fontSize: 18, color: BRAND.colors.ink, maxWidth: "46ch" }}>
        Arab tili, ingliz tili va boshqa yoʻnalishlarda tuzilgan onlayn kurslar — jonli ustozlar,
        interaktiv darslar va aniq natija bilan.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <a href="/panel.html" style={{ background: BRAND.colors.brand, color: "#fff", padding: "12px 20px", borderRadius: 9, textDecoration: "none", fontWeight: 600 }}>
          Kurslarni koʻrish
        </a>
        <a href="/login" style={{ border: `1px solid ${BRAND.colors.brand}`, color: BRAND.colors.brand, padding: "12px 20px", borderRadius: 9, textDecoration: "none", fontWeight: 600 }}>
          Bepul darsga yozilish
        </a>
      </div>
      {/* TODO: Hero, statistika, kurslar grid, why-us, how it works, ustozlar,
          natijalar, testimonials, FAQ, CTA, footer — dizayn tizimi komponentlari bilan. */}
    </main>
  );
}
