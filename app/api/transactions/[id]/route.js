import { pool } from '@/lib/db';
import { json, fail, handleError, readBody, parseId } from '@/lib/http';
import { validateTransaction } from '@/lib/transactionInput';

export const dynamic = 'force-dynamic';

// UPDATE: ubah transaksi
export async function PUT(request, { params }) {
  try {
    const id = parseId((await params).id);
    if (!id) return fail('ID tidak valid.');

    const body = await readBody(request);
    const { error, value } = await validateTransaction(body);
    if (error) return fail(error);

    const [result] = await pool.query(
      `UPDATE transactions
       SET type = ?, category_id = ?, amount = ?, description = ?, transaction_date = ?
       WHERE id = ?`,
      [value.type, value.categoryId, value.amount, value.description, value.date, id],
    );
    if (result.affectedRows === 0) return fail('Transaksi tidak ditemukan.', 404);
    return json({ id });
  } catch (err) {
    return handleError(err);
  }
}

// DELETE: hapus transaksi
export async function DELETE(_request, { params }) {
  try {
    const id = parseId((await params).id);
    if (!id) return fail('ID tidak valid.');

    const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
    if (result.affectedRows === 0) return fail('Transaksi tidak ditemukan.', 404);
    return json({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
