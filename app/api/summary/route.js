import { pool } from '@/lib/db';
import { json, handleError } from '@/lib/http';

export const dynamic = 'force-dynamic';

// Ringkasan: total income, total expense, dan sisa uang (income - expense).
export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT type, COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
       FROM transactions GROUP BY type`,
    );

    let income = 0;
    let expense = 0;
    for (const r of rows) {
      if (r.type === 'income') income = Number(r.total);
      if (r.type === 'expense') expense = Number(r.total);
    }

    return json({ income, expense, balance: income - expense });
  } catch (err) {
    return handleError(err);
  }
}
