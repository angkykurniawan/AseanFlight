// ============================================================
// geo.js – Utilitas geografi untuk filter wilayah ASEAN
// ============================================================
import { ASEAN_COUNTRIES } from '../config.js';

/**
 * Menentukan kode negara ASEAN berdasarkan koordinat (perkiraan bounding box).
 * Mengembalikan kode negara (e.g. 'ID') atau null bila di luar semua ASEAN.
 * Catatan: penentuan berdasarkan perkiraan posisi, bukan batas resmi.
 * @param {number} lat
 * @param {number} lon
 * @returns {string|null}
 */
export function getAseanCountry(lat, lon) {
  if (lat == null || lon == null) return null;
  for (const country of ASEAN_COUNTRIES) {
    const [latMin, lonMin, latMax, lonMax] = country.bbox;
    if (lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax) {
      return country.code;
    }
  }
  return null;
}

/**
 * Apakah koordinat berada dalam bounding box suatu negara ASEAN?
 * @param {string} countryCode
 * @param {number} lat
 * @param {number} lon
 * @returns {boolean}
 */
export function isInCountryBbox(countryCode, lat, lon) {
  const country = ASEAN_COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return false;
  const [latMin, lonMin, latMax, lonMax] = country.bbox;
  return lat >= latMin && lat <= latMax && lon >= lonMin && lon <= lonMax;
}

/**
 * Mendapatkan bounds Leaflet [[latMin, lonMin], [latMax, lonMax]] untuk sebuah negara.
 * @param {string} countryCode
 * @returns {[[number,number],[number,number]]|null}
 */
export function getCountryBounds(countryCode) {
  const country = ASEAN_COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return null;
  const [latMin, lonMin, latMax, lonMax] = country.bbox;
  return [[latMin, lonMin], [latMax, lonMax]];
}
