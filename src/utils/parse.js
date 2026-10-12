// ============================================================
// parse.js – Parsing state vector OpenSky Network
// ============================================================
import { getAseanCountry } from './geo.js';
import { msToKmh, msToKnot } from './convert.js';
import { ALTITUDE_CATEGORIES } from '../config.js';

/**
 * Mengubah array state vector OpenSky menjadi objek pesawat yang lebih mudah dipakai.
 * Indeks sesuai dokumentasi OpenSky:
 *   [0]  icao24
 *   [1]  callsign
 *   [2]  origin_country
 *   [5]  longitude
 *   [6]  latitude
 *   [7]  baro_altitude (m)
 *   [8]  on_ground
 *   [9]  velocity (m/s)
 *   [10] true_track (derajat dari utara, clockwise)
 *   [11] vertical_rate (m/s)
 *
 * @param {Array} sv  – state vector mentah
 * @returns {object|null}  – null bila koordinat tidak tersedia
 */
export function parseStateVector(sv) {
  const lon = sv[5];
  const lat = sv[6];

  // Buang bila koordinat tidak ada
  if (lon == null || lat == null) return null;

  const altitudeM = sv[7] ?? null;
  const velocityMs = sv[9] ?? null;
  const trueTrack  = sv[10] ?? 0;

  const airspaceCountry = getAseanCountry(lat, lon);

  return {
    icao24:          (sv[0] ?? '').trim(),
    callsign:        sv[1] ? sv[1].trim() || 'N/A' : 'N/A',
    originCountry:   sv[2] ?? 'N/A',
    longitude:       lon,
    latitude:        lat,
    altitudeM:       altitudeM,
    onGround:        sv[8] === true,
    velocityMs:      velocityMs,
    velocityKmh:     msToKmh(velocityMs),
    velocityKnot:    msToKnot(velocityMs),
    trueTrack:       trueTrack,
    verticalRate:    sv[11] ?? null,
    airspaceCountry, // kode negara ASEAN berdasarkan posisi (bisa null)
    altCategory:     getAltCategory(altitudeM, sv[8]),
  };
}

/**
 * Menentukan kategori ketinggian sebuah pesawat.
 * @param {number|null} altM
 * @param {boolean} onGround
 * @returns {string}
 */
export function getAltCategory(altM, onGround) {
  if (onGround || altM == null || altM <= 0) return ALTITUDE_CATEGORIES[0].label;
  for (const cat of ALTITUDE_CATEGORIES.slice(1)) {
    const belowMax = cat.max == null || altM < cat.max;
    if (altM >= cat.min && belowMax) return cat.label;
  }
  return ALTITUDE_CATEGORIES[ALTITUDE_CATEGORIES.length - 1].label;
}

/**
 * Mem-parse respons JSON dari OpenSky dan mengembalikan daftar pesawat
 * yang berada di wilayah udara negara ASEAN.
 * @param {object} json  – respons JSON OpenSky
 * @returns {object[]}
 */
export function parseOpenSkyResponse(json) {
  if (!json || !Array.isArray(json.states)) return [];
  const flights = [];
  for (const sv of json.states) {
    const flight = parseStateVector(sv);
    if (!flight) continue;
    // Hanya pertahankan pesawat yang berada di atas salah satu negara ASEAN
    if (!flight.airspaceCountry) continue;
    flights.push(flight);
  }
  return flights;
}
