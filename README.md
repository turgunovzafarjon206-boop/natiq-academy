# Natiq Academy

Onlayn taʼlim boshqaruv platformasi — **LMS + Talaba/Oʻqituvchi boshqaruvi +
Admin panel + Telegram bot**. Modulli, kengaytiriladigan va ishlab chiqarishga
tayyor arxitektura (10 000+ oʻquvchiga moʻljallangan).

> Bu — **1-bosqich skeleti (scaffold)**. Toʻliq arxitektura hujjati va interaktiv
> UI prototipi alohida yetkazilgan. Bu repozitoriy poydevorni beradi: sxema,
> RBAC, API namunalari, i18n, Telegram va toʻlov abstraksiyalari, Docker.

## Texnologiyalar
Next.js 15 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Redis ·
S3-mos saqlash · Zod · next-intl · Recharts · Telegram Bot API · Docker.

## Tez boshlash

```bash
cp .env.example .env            # qiymatlarni toʻldiring
docker compose up -d db redis   # PostgreSQL + Redis
npm install
npm run db:migrate              # sxemani qoʻllash
npm run db:seed                 # rollar, ruxsatlar, super admin, nishonlar
npm run dev                     # http://localhost:3000
```

Butun stack'ni konteynerda ishga tushirish: `docker compose up --build`.

## Render.com'ga deploy (render uchun tayyor)

Loyiha Render Blueprint (`render.yaml`) bilan bir tugmada joylashtiriladi.

1. Loyihani GitHub repozitoriyasiga yuklang (masalan `natiq-academy`).
2. Render'da **New + → Blueprint** → repozitoriyani tanlang. `render.yaml`
   avtomatik oʻqiladi va **web servis + PostgreSQL** yaratiladi.
3. Deploy tugagach, birinchi marta ma'lumotlar bazasini toʻldiring —
   Render'dagi servis **Shell** oynasida:
   ```bash
   npm run db:seed      # rollar, ruxsatlar, super admin, nishonlar
   ```
4. `APP_URL` (masalan `https://natiq-academy.onrender.com`) va kerak boʻlsa
   `TELEGRAM_BOT_TOKEN` ni Render dashboard → Environment'da kiriting.

Kirish: super admin — telefon `+998900000000`, parol `admin123` (skelet;
ishlab chiqarishdan oldin argon2 hash'ga oʻting va parolni almashtiring).

> Jadvallar birinchi deployda `prisma db push` orqali sxemadan yaratiladi.
> Ishlab chiqarish uchun migratsiyaga oʻting: lokalda `npx prisma migrate dev
> --name init` → commit → `render.yaml` startCommand'ini `prisma migrate deploy`
> ga oʻzgartiring.

Muqobil: Render'da **Docker** muhitini tanlab, mavjud `Dockerfile` bilan ham
deploy qilish mumkin.

## Loyiha tuzilmasi

```
prisma/schema.prisma      # 26+ jadval, indekslar, bogʻlanishlar
src/
  app/                    # (public) (auth) app teacher admin parent  + api/*
  modules/                # biznes-mantiq (domenlar) — modules/README.md
  components/ui/          # qayta ishlatiladigan dizayn tizimi (shadcn/ui)
  lib/                    # db, api (javob qobigʻi), auth+RBAC, audit, storage
  config/                 # brand.ts (white-label), permissions.ts (RBAC)
  i18n/                   # uz / ru / en / ar  (AR — RTL tayyor)
  server/telegram/        # bot (webhook-ready)
```

## Asosiy arxitektura qarorlari

- **Modulli monolit** — kichik jamoa uchun tez, bitta tranzaksion BD; har modul
  keyin alohida servisga chiqarilishi mumkin.
- **RBAC — deny by default.** Nozik ruxsatlar (`resource.action`) faqat
  `src/config/permissions.ts` da; DB seed avtomatik sinxronlaydi. Foydalanuvchi
  hech qachon ruxsati yoʻq maʼlumotni koʻrmaydi.
- **Izchil API qobigʻi** — `{ ok, data, error, meta }`; har yozuv Zod bilan
  validatsiya qilinadi, RBAC'dan oʻtadi, `AuditLog`ga yoziladi.
- **Toʻlov provayderi qat'iy kodlanmagan** — `PaymentProviderAdapter` interfeysi;
  Click / Payme / Uzum keyin registratsiya qilinadi. Webhook idempotent
  (`providerTxnId` unique).
- **White-label** — nom/logo/rang `src/config/brand.ts` da, matnlar `i18n/*`.
- **Kelajakka tayyor** — CRM (`Lead`) va AI modullari uchun sxema/API allaqachon
  joyida; tizimni qayta qurish shart emas.

## Xavfsizlik
Parol hash (argon2) · session + JWT · RBAC · Zod validatsiya · rate limiting ·
CSRF/XSS himoyasi · Prisma parametrlangan soʻrovlar (SQL-injection) · imzolangan
media URL · audit log.

## Rivojlanish yoʻl xaritasi
1. Poydevor → 2. Talaba → 3. Oʻqituvchi → 4. Admin → 5. Toʻlov/Sertifikat →
6. Telegram → 7. Analitika → 8. Gamifikatsiya → 9. CRM → 10. AI.
