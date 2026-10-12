// ============================================================
// useFlightStats.js – Statistik dan agregasi data penerbangan
// ============================================================
import { useMemo, useState, useCallback } from 'react';
import { ASEAN_COUNTRIES, MAX_HISTORY_POINTS, ALTITUDE_CATEGORIES } from '../config.js';

/**
 * Menghitung statistik agregat dari daftar pesawat.
 * Semua kalkulasi di useMemo agar tidak dihitung ulang tanpa perlu.
 *
 * @param {object[]} flights  – array pesawat dari FlightContext
 * @returns {{
 *   total: number,
 *   airborne: number,
 *   onGround: number,
 *   avgAltitudeM: number|null,
 *   avgSpeedKmh: number|null,
 *   fastestKmh: number|null,
 *   highestM: number|null,
 *   byCountry: {code, name, count}[],
 *   byAltCategory: {label, count}[],
 *   callsignCompletenessPercent: number,
 *   countryCoverage: number,
 * }}
 */
export function useFlightStats(flights) {
  return useMemo(() => {
    const total = flights.length;
    const airborne = flights.filter((f) => !f.onGround).length;
    const onGround = total - airborne;

    const airborneFlights = flights.filter((f) => !f.onGround);

    // Ketinggian rata-rata (hanya yang di udara & punya data)
    const altsWithData = airborneFlights
      .map((f) => f.altitudeM)
      .filter((a) => a != null && a > 0);
    const avgAltitudeM = altsWithData.length
      ? Math.round(altsWithData.reduce((s, v) => s + v, 0) / altsWithData.length)
      : null;

    // Kecepatan rata-rata (yang di udara & punya data)
    const speedsWithData = airborneFlights
      .map((f) => f.velocityKmh)
      .filter((v) => v != null && v > 0);
    const avgSpeedKmh = speedsWithData.length
      ? Math.round(speedsWithData.reduce((s, v) => s + v, 0) / speedsWithData.length)
      : null;

    // Tercepat & tertinggi
    const fastestKmh = speedsWithData.length ? Math.max(...speedsWithData) : null;
    const highestM   = altsWithData.length   ? Math.max(...altsWithData)   : null;

    // Per negara wilayah udara
    const countMap = {};
    for (const f of flights) {
      if (f.airspaceCountry) {
        countMap[f.airspaceCountry] = (countMap[f.airspaceCountry] || 0) + 1;
      }
    }
    const byCountry = ASEAN_COUNTRIES
      .map((c) => ({ code: c.code, name: c.name, count: countMap[c.code] || 0 }))
      .sort((a, b) => b.count - a.count);

    // Per kategori ketinggian
    const catMap = {};
    for (const f of flights) {
      catMap[f.altCategory] = (catMap[f.altCategory] || 0) + 1;
    }
    const byAltCategory = ALTITUDE_CATEGORIES.map((cat) => ({
      label: cat.label,
      count: catMap[cat.label] || 0,
      color: cat.color,
    }));

    // Kelengkapan callsign
    const withCallsign = flights.filter((f) => f.callsign !== 'N/A').length;
    const callsignCompletenessPercent = total > 0
      ? Math.round((withCallsign / total) * 100)
      : 0;

    // Cakupan negara (berapa negara ASEAN yang punya ≥1 pesawat)
    const countryCoverage = Object.keys(countMap).length;

    return {
      total, airborne, onGround,
      avgAltitudeM, avgSpeedKmh,
      fastestKmh, highestM,
      byCountry, byAltCategory,
      callsignCompletenessPercent,
      countryCoverage,
    };
  }, [flights]);
}

/**
 * Menyimpan riwayat titik data untuk sparkline (maks MAX_HISTORY_POINTS).
 * Mengembalikan [history, pushHistory] di mana history adalah array snapshot.
 *
 * @returns {[object[], function]}
 */
export function useFlightHistory() {
  const [history, setHistory] = useState([]);

  const pushHistory = useCallback((flights) => {
    if (!flights) return;
    const snapshot = {
      ts: Date.now(),
      total: flights.length,
      airborne: flights.filter((f) => !f.onGround).length,
      avgAlt: (() => {
        const a = flights.filter((f) => !f.onGround && f.altitudeM > 0).map((f) => f.altitudeM);
        return a.length ? Math.round(a.reduce((s, v) => s + v, 0) / a.length) : 0;
      })(),
      avgSpeed: (() => {
        const s = flights.filter((f) => !f.onGround && f.velocityKmh > 0).map((f) => f.velocityKmh);
        return s.length ? Math.round(s.reduce((s, v) => s + v, 0) / s.length) : 0;
      })(),
    };
    setHistory((prev) => {
      const next = [...prev, snapshot];
      return next.length > MAX_HISTORY_POINTS ? next.slice(-MAX_HISTORY_POINTS) : next;
    });
  }, []);

  return [history, pushHistory];
}
