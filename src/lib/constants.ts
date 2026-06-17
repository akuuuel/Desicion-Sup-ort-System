export const RI: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export const DEFAULT_KRITERIA = [
  { kode: 'C1', nama: 'Lokasi', tipe: 'cost' },
  { kode: 'C2', nama: 'Fasilitas', tipe: 'benefit' },
  { kode: 'C3', nama: 'Uang Saku', tipe: 'benefit' },
  { kode: 'C4', nama: 'Pengalaman Kerja', tipe: 'benefit' },
  { kode: 'C5', nama: 'Peluang Direkrut', tipe: 'benefit' },
];

export const DEFAULT_ALTERNATIF = [
  { kode: 'A1', nama: 'PT Telkom Indonesia' },
  { kode: 'A2', nama: 'PT PLN' },
  { kode: 'A3', Bank: 'Mandiri' },
  { kode: 'A4', nama: 'Diskominfo Kota Bekasi' },
  { kode: 'A5', nama: 'PT Astra International' },
];
