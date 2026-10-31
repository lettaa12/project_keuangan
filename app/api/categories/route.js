import { pool } from '@/lib/db';
import { TYPES, json, fail, handleError, readBody } from '@/lib/http';

export const dynamic = 'force-dynamic';

// READ: daftar kategori (opsional ?type=income|expense)
export async function GET(request) {
  try {
    const type = new URL(request.url).searchParams.get('type');
    let sql = 'SELECT id, name, type FROM categories';
    const params = [];
    if (type) {
      if (!TYPES.includes(type)) return fail('Tipe tidak valid.');
      sql += ' WHERE type = ?';
      params.push(type);
    }
    sql += ' ORDER BY type, name';
    const [rows] = await pool.query(sql, params);
    return json(rows);
  } catch (err) {
    return handleError(err);
  }
}

// CREATE: tambah kategori
export async function POST(request) {
  try {
    const body = await readBody(request);
    const name = String(body?.name ?? '').trim();
    const type = body?.type;
    if (!name) return fail('Nama kategori wajib diisi.');
    if (name.length > 100) return fail('Nama kategori maksimal 100 karakter.');
    if (!TYPES.includes(type)) return fail('Tipe harus income atau expense.');

    const [result] = await pool.query('INSERT INTO categories (name, type) VALUES (?, ?)', [
      name,
      type,
    ]);
    return json({ id: result.insertId, name, type }, 201);
  } catch (err) {
    return handleError(err);
  }
}
