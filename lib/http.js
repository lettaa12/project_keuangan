import { NextResponse } from 'next/server';

export const TYPES = ['income', 'expense'];

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Mengubah error MySQL / tak terduga menjadi respons JSON yang rapi.
export function handleError(err) {
  if (err?.code === 'ER_DUP_ENTRY') {
    return fail('Data dengan nama tersebut sudah ada.', 409);
  }
  if (err?.code === 'ER_ROW_IS_REFERENCED_2') {
    return fail('Kategori masih dipakai oleh transaksi, tidak bisa dihapus.', 409);
  }
  console.error(err);
  return fail('Terjadi kesalahan pada server.', 500);
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
