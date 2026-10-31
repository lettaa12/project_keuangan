'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/client';
import SummaryCards from './SummaryCards';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategoryManager from './CategoryManager';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams();
      if (filterType) qs.set('type', filterType);
      if (filterMonth) qs.set('month', filterMonth);

      const [s, c, t] = await Promise.all([
        api('/api/summary'),
        api('/api/categories'),
        api(`/api/transactions?${qs.toString()}`),
      ]);
      setSummary(s);
      setCategories(c);
      setTransactions(t);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterMonth]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(t) {
    if (!confirm(`Hapus transaksi "${t.category_name}"?`)) return;
    try {
      await api(`/api/transactions/${t.id}`, { method: 'DELETE' });
      if (editing?.id === t.id) setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(t) {
    setEditing(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Atur Keuangan</h1>
        <p className="muted">Catat income dan expense, pantau sisa uang Anda.</p>
      </header>

      {error && <p className="error banner">{error}</p>}

      <SummaryCards summary={summary} />

      <div className="grid">
        <TransactionForm
          categories={categories}
          editing={editing}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onCancel={() => setEditing(null)}
        />
        <TransactionList
          transactions={transactions}
          loading={loading}
          filterType={filterType}
          filterMonth={filterMonth}
          onFilterType={setFilterType}
          onFilterMonth={setFilterMonth}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CategoryManager categories={categories} onChanged={load} />
    </main>
  );
}
