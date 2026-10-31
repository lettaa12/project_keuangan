import mysql from 'mysql2/promise';

function buildSsl() {
  // Aiven mewajibkan SSL.
  if (process.env.DB_CA && process.env.DB_CA.trim()) {
    return { ca: process.env.DB_CA.replace(/\\n/g, '\n') };
  }
  return { rejectUnauthorized: false };
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: buildSsl(),
    waitForConnections: true,
    // Kecil saja, karena tiap instance serverless Vercel membuat pool sendiri.
    connectionLimit: 3,
    maxIdle: 3,
    idleTimeout: 20000,
    dateStrings: true, // DATE tetap berupa string 'YYYY-MM-DD'
    decimalNumbers: true, // DECIMAL menjadi number, bukan string
  });
}

// Cache pool di globalThis agar tidak dibuat ulang saat hot reload / warm invocation.
const globalForDb = globalThis;
export const pool = globalForDb.__mysqlPool ?? (globalForDb.__mysqlPool = createPool());
