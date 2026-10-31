import { pool } from '@/lib/db';
import { TYPES, isValidDate, parseId } from '@/lib/http';

// Validasi body untuk create/update transaksi.
// Mengembalikan { error } atau { value }.
export async function validateTransaction(body) {
  const type = body?.type;
  const categoryId = parseId(body?.category_id);
  const amount = Number(body?.amount);
  const description = String(body?.description ?? '').trim();
  const date = body?.transaction_date;

  if (!TYPES.includes(type)) return { error: 'Tipe harus income atau expense.' };
  if (!categoryId) return { error: 'Kategori wajib dipilih.' };
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'Nominal harus lebih dari 0.' };
  if (amount > 9999999999999) return { error: 'Nominal terlalu besar.' };
  if (description.length > 255) return { error: 'Keterangan maksimal 255 karakter.' };
  if (!isValidDate(date)) return { error: 'Tanggal tidak valid (format YYYY-MM-DD).' };

  // Pastikan kategori ada dan tipenya sama dengan tipe transaksi.
  const [rows] = await pool.query('SELECT type FROM categories WHERE id = ?', [categoryId]);
  if (rows.length === 0) return { error: 'Kategori tidak ditemukan.' };
  if (rows[0].type !== type) return { error: 'Tipe kategori tidak sesuai dengan tipe transaksi.' };

  return {
    value: { type, categoryId, amount: Math.round(amount * 100) / 100, description, date },
  };
}
