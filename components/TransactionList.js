'use client';

import { formatDate, formatRupiah } from '@/lib/client';

export default function TransactionList({
  transactions,
  loading,
  filterType,
  filterMonth,
  onFilterType,
  onFilterMonth,
  onEdit,
  onDelete,
}) {
  return (
    <section className="panel">
      <div className="list-head">
        <h2>Riwayat transaksi</h2>
        <div className="filters">
          <select value={filterType} onChange={(e) => onFilterType(e.target.value)} aria-label="Filter tipe">
            <option value="">Semua</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => onFilterMonth(e.target.value)}
            aria-label="Filter bulan"
          />
          {filterMonth && (
            <button className="btn small" onClick={() => onFilterMonth('')}>
              Semua bulan
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="muted">Memuat…</p>
      ) : transactions.length === 0 ? (
        <p className="muted">Belum ada transaksi.</p>
      ) : (
        <ul className="tx-list">
          {transactions.map((t) => (
            <li key={t.id} className="tx">
              <div className="tx-main">
                <strong>{t.category_name}</strong>
                <span className="muted">
                  {formatDate(t.transaction_date)}
                  {t.description ? ` · ${t.description}` : ''}
                </span>
              </div>
              <div className={`tx-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '−'}
                {formatRupiah(t.amount)}
              </div>
              <div className="tx-actions">
                <button className="btn small" onClick={() => onEdit(t)}>
                  Ubah
                </button>
                <button className="btn small danger" onClick={() => onDelete(t)}>
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
