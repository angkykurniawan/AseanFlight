// ============================================================
// config.js – Semua konstanta aplikasi SkyWatch ASEAN
// ============================================================

// --- OpenSky Network API ---
// Di development, request dikirim lewat Vite proxy (/api/opensky/states/all)
// agar tidak kena CORS browser. Proxy meneruskannya ke opensky-network.org
// di sisi server (Node.js). Di production build, ganti ke URL langsung atau
// deploy proxy sendiri (Nginx, Caddy, dll.).
export const OPENSKY_API_URL = '/api/opensky/states/all';

// Bounding box seluruh wilayah ASEAN untuk satu request ke OpenSky
export const ASEAN_BBOX = {
  lamin: -11.5,
  lomin: 92.0,
  lamax: 28.5,
  lomax: 141.5,
};

// --- Interval polling & backoff ---
export const POLL_INTERVAL_MS = 60_000;           // 60 detik (normal)
export const BACKOFF_DURATIONS_MS = [
  60_000,   // backoff 1: 60 detik
  120_000,  // backoff 2: 120 detik
  300_000,  // backoff 3: 300 detik
];
export const COUNTDOWN_TICK_MS = 1_000;

// --- Riwayat sparkline ---
export const MAX_HISTORY_POINTS = 40;

// --- Target Scorecard ---
export const SCORECARD_TARGETS = {
  avgAltitudeM: 10_000,   // m
  avgSpeedKmh: 800,        // km/h
  airbornePercent: 85,     // %
  countryCoverage: 11,     // negara ASEAN
  callsignCompleteness: 95, // %
  apiHealthPercent: 100,   // %
};

// --- Leaflet ---
// Bounds awal peta: [[selatan, barat], [utara, timur]]
export const ASEAN_MAP_BOUNDS = [
  [-11.5, 92.0],
  [28.5, 141.5],
];

// --- Kategori ketinggian (meter) ---
export const ALTITUDE_CATEGORIES = [
  { label: 'Darat',          min: null,   max: 0,      color: '#6b7280' },
  { label: 'Rendah <3 000 m', min: 0,     max: 3_000,  color: '#10b981' },
  { label: 'Menengah 3–8 km', min: 3_000, max: 8_000,  color: '#3b82f6' },
  { label: 'Tinggi 8–12 km',  min: 8_000, max: 12_000, color: '#8b5cf6' },
  { label: 'Sangat Tinggi >12 km', min: 12_000, max: null, color: '#f59e0b' },
];

// --- Negara ASEAN + bounding box perkiraan per negara ---
// Urutan: [latMin, lonMin, latMax, lonMax]
// Catatan: bounding box adalah perkiraan untuk filter sisi-klien;
// posisi tepat di perbatasan mungkin tidak akurat 100%.
export const ASEAN_COUNTRIES = [
  {
    code: 'ID',
    name: 'Indonesia',
    bbox: [-11.0, 95.0, 6.0, 141.0],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    bbox: [0.8, 99.6, 7.4, 119.3],
  },
  {
    code: 'SG',
    name: 'Singapura',
    bbox: [1.15, 103.6, 1.48, 104.1],
  },
  {
    code: 'TH',
    name: 'Thailand',
    bbox: [5.6, 97.3, 20.5, 105.7],
  },
  {
    code: 'PH',
    name: 'Filipina',
    bbox: [4.5, 116.9, 21.1, 126.6],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    bbox: [8.3, 102.1, 23.4, 109.5],
  },
  {
    code: 'BN',
    name: 'Brunei',
    bbox: [4.0, 114.0, 5.1, 115.4],
  },
  {
    code: 'KH',
    name: 'Kamboja',
    bbox: [9.9, 102.3, 14.7, 107.7],
  },
  {
    code: 'LA',
    name: 'Laos',
    bbox: [13.9, 100.1, 22.5, 107.7],
  },
  {
    code: 'MM',
    name: 'Myanmar',
    bbox: [9.6, 92.2, 28.5, 101.2],
  },
  {
    code: 'TL',
    name: 'Timor Leste',
    bbox: [-9.5, 124.0, -8.1, 127.4],
  },
];

// Peta kode → nama untuk lookup cepat
export const COUNTRY_NAME_BY_CODE = Object.fromEntries(
  ASEAN_COUNTRIES.map((c) => [c.code, c.name])
);

// Tab navigasi
export const NAV_TABS = [
  { id: 'overview',  label: 'Ikhtisar' },
  { id: 'livemap',   label: 'Peta Live' },
  { id: 'countries', label: 'Negara ASEAN' },
  { id: 'data',      label: 'Data' },
];

// Jumlah baris maksimal di tab Data
export const DATA_TAB_MAX_ROWS = 100;
