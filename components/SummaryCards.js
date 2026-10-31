import { formatRupiah } from '@/lib/client';

export default function SummaryCards({ summary }) {
  const balance = summary?.balance ?? 0;

  return (
    <section className="cards">
      <div className="card card-balance">
        <span className="card-label">Sisa uang sekarang</span>
        <strong className={`card-value ${balance < 0 ? 'neg' : ''}`}>{formatRupiah(balance)}</strong>
        <span className="card-hint">Total income dikurangi total expense</span>
      </div>
      <div className="card">
        <span className="card-label">Total income</span>
        <strong className="card-value income">{formatRupiah(summary?.income ?? 0)}</strong>
      </div>
      <div className="card">
        <span className="card-label">Total expense</span>
        <strong className="card-value expense">{formatRupiah(summary?.expense ?? 0)}</strong>
      </div>
    </section>
  );
}
