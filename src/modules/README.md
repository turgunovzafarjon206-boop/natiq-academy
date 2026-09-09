# Modullar (biznes-mantiq / domenlar)

Har bir modul oʻz chegarasiga ega izolyatsiya qilingan domen. Bu tuzilma yuk
oshganda modulni (masalan, `telegram`, `analytics`) alohida servisga chiqarishni
osonlashtiradi — kod boshqa joyga tarqalib ketmaydi.

| Modul | Vazifasi | Bosqich |
|---|---|---|
| `auth` | Kirish, session, JWT, Telegram bogʻlash | 1 |
| `rbac` | Rol/ruxsat tekshiruvi (`src/config/permissions.ts`) | 1 |
| `users` | Foydalanuvchi va rol-profillar | 1 |
| `courses` | Kurs → Modul → Dars → Material | 2 |
| `lessons` | Dars player, video watch progress | 2 |
| `homework` | Vazifa yaratish, topshirish, baholash | 3 |
| `quizzes` | Test/imtihon, avtomatik baholash | 3 |
| `attendance` | Davomat (present/absent/late/excused) | 3 |
| `payments` | Toʻlov + provayder abstraksiyasi (`provider.ts`) | 5 |
| `certificates` | Sertifikat + QR + ochiq tekshiruv | 5 |
| `notifications` | Koʻp kanalli bildirishnoma (platform/tg/email/sms) | 5 |
| `telegram` | Bot integratsiyasi (`src/server/telegram`) | 6 |
| `analytics` | KPI, grafiklar, retention/churn | 7 |
| `gamification` | XP, nishon, streak, reyting | 8 |
| `crm` | Lead voronkasi (kelajakka tayyor) | 9 |
| `ai` | AI tutor/talaffuz/feedback (kelajakka tayyor) | 10 |

Har modul odatda quyidagilarni saqlaydi:
`service.ts` (biznes-mantiq) · `schema.ts` (Zod validatsiya) · `types.ts`.
Route handler'lar (`src/app/api/*`) faqat modul service'larini chaqiradi.
