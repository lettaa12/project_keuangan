import { pool } from '@/lib/db';
import { json, fail, handleError, readBody, parseId } from '@/lib/http';

export const dynamic = 'force-dynamic';

// UPDATE: ubah nama kategori
export async function PUT(request, { params }) {
  try {
    const id = parseId((await params).id);
    if (!id) return fail('ID tidak valid.');

    const body = await readBody(request);
    const name = String(body?.name ?? '').trim();
    if (!name) return fail('Nama kategori wajib diisi.');
    if (name.length > 100) return fail('Nama kategori maksimal 100 karakter.');

    const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) return fail('Kategori tidak ditemukan.', 404);
    return json({ id, name });
  } catch (err) {
    return handleError(err);
  }
}

// DELETE: hapus kategori (ditolak jika masih dipakai transaksi)
export async function DELETE(_request, { params }) {
  try {
    const id = parseId((await params).id);
    if (!id) return fail('ID tidak valid.');

    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) return fail('Kategori tidak ditemukan.', 404);
    return json({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
