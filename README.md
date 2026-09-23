# Natiq Academy

Arab tili akademiyasi sayti — ommaviy sahifa, kirish (login) va rol asosidagi
boshqaruv panellari (admin, moliya, oʻqituvchi, talaba). Butun sayt bitta
`index.html` faylida — build ham, server ham kerak emas.

## Deploy

### Vercel
1. Bu repozitoriyani GitHub’ga yuklang (`index.html` ildizda boʻlsin).
2. vercel.com → **Add New → Project** → repozitoriyani **Import**.
3. **Framework Preset: Other** → **Deploy**. Tayyor.

### Netlify (muqobil)
netlify.com → **Add new site → Import** → repozitoriyani tanlang → Deploy.
(Yoki `index.html` turgan papkani Netlify Drop’ga sudrab tashlang.)

## Kirish (admin)
- Telefon: `+998900000000`
- Parol: `admin123`

Kirgach: **Sozlamalar** — sayt matni, telefon va Telegram sozlamalari;
**Arizalar** — saytdan tushgan lidlar soni va roʻyxati.

## Telegram — arizalar
Saytdagi «Kursga yozilish» formasidan yuborilgan arizalar Telegram botga tushadi.
Bir martalik sozlash:
1. Telegram’da botga **/start** yozing.
2. Oching: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. `"chat":{"id": ... }` raqamini nusxa oling.
4. Saytda: **Sozlamalar → Telegram chat_id** ga qoʻying → **Saqlash → Test yuborish**.

> Eslatma: bot tokeni `index.html` ichida koʻrinadi. Jiddiy foydalanish uchun
> tokenni yashiradigan proksi (masalan Google Apps Script) tavsiya etiladi.

## Maʼlumotlar
Hozircha maʼlumotlar brauzer xotirasida (localStorage) saqlanadi. Bir nechta
qurilma oʻrtasida umumiy baza kerak boʻlsa — keyingi bosqichda haqiqiy serverga
(masalan Neon Postgres) ulanadi.
