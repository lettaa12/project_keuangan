'use client';

import { useState } from 'react';
import { api } from '@/lib/client';

export default function CategoryManager({ categories, onChanged }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  async function run(fn) {
    setError('');
    try {
      await fn();
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  function add(e) {
    e.preventDefault();
    run(async () => {
      await api('/api/categories', { method: 'POST', body: JSON.stringify({ name, type }) });
      setName('');
    });
  }

  function saveEdit(id) {
    run(async () => {
      await api(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name: editName }) });
      setEditingId(null);
    });
  }

  function remove(c) {
    if (!confirm(`Hapus kategori "${c.name}"?`)) return;
    run(() => api(`/api/categories/${c.id}`, { method: 'DELETE' }));
  }

  function renderGroup(groupType, title) {
    const items = categories.filter((c) => c.type === groupType);
    return (
      <div className="cat-group">
        <h3 className={groupType}>{title}</h3>
        {items.length === 0 && <p className="muted">Belum ada kategori.</p>}
        <ul className="cat-list">
          {items.map((c) => (
            <li key={c.id}>
              {editingId === c.id ? (
                <>
                  <input
                    value={editName}
                    maxLength={100}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button className="btn small primary" onClick={() => saveEdit(c.id)}>
                    Simpan
                  </button>
                  <button className="btn small" onClick={() => setEditingId(null)}>
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <span className="spacer" />
                  <button
                    className="btn small"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                  >
                    Ubah
                  </button>
                  <button className="btn small danger" onClick={() => remove(c)}>
                    Hapus
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="panel">
      <h2>Kategori</h2>

      <form className="row cat-form" onSubmit={add}>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Tipe kategori">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          required
          maxLength={100}
          placeholder="Nama kategori baru"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn primary" type="submit">
          Tambah
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="cat-groups">
        {renderGroup('income', 'Kategori income')}
        {renderGroup('expense', 'Kategori expense')}
      </div>
    </section>
  );
}
