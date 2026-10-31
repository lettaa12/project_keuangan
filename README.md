# Atur Keuangan

Aplikasi pencatat keuangan sederhana: income, expense, kategori yang bisa ditambah, dan sisa uang
(total income dikurangi total expense).

Stack: Next.js 15 (App Router), MySQL (`mysql2`), siap deploy ke Vercel dengan database di Aiven.

## Fitur

- CRUD transaksi income dan expense (tambah, lihat, ubah, hapus)
- CRUD kategori income dan expense (tambah, lihat, ubah nama, hapus)
- Kategori yang masih dipakai transaksi tidak bisa dihapus
- Kartu ringkasan: sisa uang, total income, total expense
- Filter riwayat berdasarkan tipe dan bulan

## Struktur

```
app/
  api/categories/        GET, POST
  api/categories/[id]/   PUT, DELETE
  api/transactions/      GET, POST
  api/transactions/[id]/ PUT, DELETE
  api/summary/           GET (income, expense, balance)
  page.js, layout.js, globals.css
components/              Dashboard, form, daftar, kategori
lib/                     db.js (pool MySQL), http.js, client.js
schema.sql               tabel + kategori awal
scripts/migrate.mjs      menjalankan schema.sql
```

## Menjalankan di lokal

1. Install dependensi:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local` dan isi koneksi database
   (bisa langsung memakai database Aiven, atau MySQL lokal dengan `DB_CA` kosong).
3. Buat tabel:
   ```bash
   npm run db:migrate
   ```
4. Jalankan:
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000

> Jika memakai MySQL lokal tanpa SSL, aplikasi tetap mencoba SSL. Untuk lokal tanpa SSL,
> ubah `ssl` di `lib/db.js` dan `scripts/migrate.mjs` menjadi `undefined`.

## Menyiapkan database di Aiven

1. Buat service **MySQL** di Aiven Console (ada free plan).
2. Di halaman Overview, salin **Host, Port, User, Password, Database name**.
3. (Opsional) Download **CA certificate** (`ca.pem`) untuk verifikasi SSL penuh.
4. Pastikan **Allowed IP addresses** mengizinkan koneksi dari luar. Vercel tidak punya IP
   tetap pada plan biasa, jadi gunakan `0.0.0.0/0` (default Aiven) atau gunakan fitur IP
   statis Vercel jika tersedia.
5. Isi `.env.local` lalu jalankan `npm run db:migrate` untuk membuat tabel di Aiven.

## Deploy ke Vercel

1. Push project ke GitHub.
2. Di Vercel: **Add New → Project**, pilih repository tersebut (framework Next.js terdeteksi otomatis).
3. Di **Settings → Environment Variables**, isi:

   | Nama          | Isi                                                        |
   | ------------- | ---------------------------------------------------------- |
   | `DB_HOST`     | host dari Aiven                                            |
   | `DB_PORT`     | port dari Aiven                                            |
   | `DB_USER`     | `avnadmin`                                                 |
   | `DB_PASSWORD` | password dari Aiven                                        |
   | `DB_NAME`     | `defaultdb` (atau nama database Anda)                      |
   | `DB_CA`       | (opsional) isi `ca.pem`                                    |

4. Deploy. Tabel sudah dibuat dari langkah migrasi di atas, jadi aplikasi langsung bisa dipakai.

## Catatan

- Pool koneksi dibuat kecil (3) karena setiap instance serverless Vercel membuat pool sendiri.
  Free plan Aiven membatasi jumlah koneksi, jadi jangan dinaikkan tanpa perlu.
- Aplikasi ini belum memiliki login. Siapa pun yang memegang URL bisa melihat dan mengubah data.
  Jika dipakai untuk data pribadi, tambahkan autentikasi (misalnya Auth.js) atau batasi akses
  lewat Vercel Deployment Protection.
