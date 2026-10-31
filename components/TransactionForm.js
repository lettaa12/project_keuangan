'use client';

import { useEffect, useState } from 'react';
import { api, todayString } from '@/lib/client';

const emptyForm = () => ({
  type: 'expense',
  category_id: '',
  amount: '',
  description: '',
  transaction_date: todayString(),
});

export default function TransactionForm({ categories, editing, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Isi form saat masuk mode edit, reset saat selesai.
  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        category_id: String(editing.category_id),
        amount: String(editing.amount),
        description: editing.description || '',
        transaction_date: editing.transaction_date,
      });
    } else {
      setForm(emptyForm());
    }
    setError('');
  }, [editing]);

  const options = categories.filter((c) => c.type === form.type);

  function setType(type) {
    setForm((f) => ({ ...f, type, category_id: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount), category_id: Number(form.category_id) };
      if (editing) {
        await api(`/api/transactions/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/api/transactions', { method: 'POST', body: JSON.stringify(payload) });
      }
      setForm(emptyForm());
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h2>{editing ? 'Ubah transaksi' : 'Tambah transaksi'}</h2>

      <div className="segmented" role="group" aria-label="Tipe transaksi">
        <button
          type="button"
          className={form.type === 'income' ? 'active income' : ''}
          onClick={() => setType('income')}
        >
          Income
        </button>
        <button
          type="button"
          className={form.type === 'expense' ? 'active expense' : ''}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
      </div>

      <label>
        Kategori
        <select
          required
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Pilih kategori…</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {options.length === 0 && (
          <small className="muted">Belum ada kategori {form.type}. Tambahkan di panel kategori.</small>
        )}
      </label>

      <label>
        Nominal (Rp)
        <input
          type="number"
          required
          min="1"
          step="any"
          inputMode="decimal"
          placeholder="50000"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </label>

      <label>
        Tanggal
        <input
          type="date"
          required
          value={form.transaction_date}
          onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
        />
      </label>

      <label>
        Keterangan (opsional)
        <input
          type="text"
          maxLength={255}
          placeholder="mis. makan siang"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="row">
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah'}
        </button>
        {editing && (
          <button className="btn" type="button" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
