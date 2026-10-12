// ============================================================
// convert.js – Konversi satuan
// ============================================================

/** Konversi meter/detik → km/jam */
export function msToKmh(ms) {
  if (ms == null) return null;
  return Math.round(ms * 3.6);
}

/** Konversi meter/detik → knot */
export function msToKnot(ms) {
  if (ms == null) return null;
  return Math.round(ms * 1.94384);
}

/** Konversi meter → kaki (feet) */
export function mToFt(m) {
  if (m == null) return null;
  return Math.round(m * 3.28084);
}

/** Konversi meter → kilometer (1 desimal) */
export function mToKm(m) {
  if (m == null) return null;
  return (m / 1000).toFixed(1);
}

/** Format ketinggian untuk ditampilkan */
export function formatAltitude(m) {
  if (m == null || m === 0) return 'N/A';
  return `${Math.round(m).toLocaleString('id-ID')} m`;
}

/** Format kecepatan km/h untuk ditampilkan */
export function formatSpeed(kmh) {
  if (kmh == null) return 'N/A';
  return `${kmh.toLocaleString('id-ID')} km/j`;
}

/** Format angka umum dengan titik ribuan */
export function formatNumber(n) {
  if (n == null) return 'N/A';
  return n.toLocaleString('id-ID');
}
