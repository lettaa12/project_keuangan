// Menjalankan schema.sql ke database (lokal maupun Aiven).
// Pemakaian: npm run db:migrate   (membaca variabel dari .env.local)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');

const ssl =
  process.env.DB_CA && process.env.DB_CA.trim()
    ? { ca: process.env.DB_CA.replace(/\\n/g, '\n') }
    : { rejectUnauthorized: false };

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  multipleStatements: true,
});

try {
  await conn.query(sql);
  console.log('Migrasi selesai: tabel categories & transactions siap.');
} catch (err) {
  console.error('Migrasi gagal:', err.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
