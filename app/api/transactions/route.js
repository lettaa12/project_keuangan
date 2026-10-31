import { pool } from '@/lib/db';
import { TYPES, json, fail, handleError, readBody } from '@/lib/http';
import { validateTransaction } from '@/lib/transactionInput';

export const dynamic = 'force-dynamic';

// READ: daftar transaksi (opsional ?type=income|expense & ?month=YYYY-MM)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const month = searchParams.get('month');

    const where = [];
    const params = [];

    if (type) {
      if (!TYPES.includes(type)) return fail('Tipe tidak valid.');
      where.push('t.type = ?');
      params.push(type);
    }
    if (month) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return fail('Format bulan harus YYYY-MM.');
      where.push("DATE_FORMAT(t.transaction_date, '%Y-%m') = ?");
      params.push(month);
    }

    const sql = `
      SELECT t.id, t.type, t.category_id, c.name AS category_name,
             t.amount, t.description, t.transaction_date
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY t.transaction_date DESC, t.id DESC
      LIMIT 500`;

    const [rows] = await pool.query(sql, params);
    return json(rows);
  } catch (err) {
    return handleError(err);
  }
}

// CREATE: tambah transaksi
export async function POST(request) {
  try {
    const body = await readBody(request);
    const { error, value } = await validateTransaction(body);
    if (error) return fail(error);

    const [result] = await pool.query(
      `INSERT INTO transactions (type, category_id, amount, description, transaction_date)
       VALUES (?, ?, ?, ?, ?)`,
      [value.type, value.categoryId, value.amount, value.description, value.date],
    );
    return json({ id: result.insertId }, 201);
  } catch (err) {
    return handleError(err);
  }
}
