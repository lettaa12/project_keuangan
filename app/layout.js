import './globals.css';

export const metadata = {
  title: 'Atur Keuangan',
  description: 'Catat pemasukan dan pengeluaran, pantau sisa uang Anda.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
