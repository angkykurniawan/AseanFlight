// ============================================================
// sampleFlights.js – Dataset sampel ~30 pesawat di rute ASEAN
// Digunakan sebagai fallback bila API OpenSky tidak terjangkau.
// Format tiap elemen sesuai state vector OpenSky:
// [icao24, callsign, origin_country, time_position, last_contact,
//  longitude, latitude, baro_altitude, on_ground, velocity,
//  true_track, vertical_rate, sensors, geo_altitude, squawk,
//  spi, position_source]
// ============================================================

const sampleFlights = [
  // Indonesia
  ['8a0101', 'GIA401 ', 'Indonesia',  1700000000, 1700000001,  106.65, -6.12,  10972, false, 235, 45,  0, null, 10900, '2000', false, 0],
  ['8a0102', 'GIA502 ', 'Indonesia',  1700000000, 1700000001,  112.74, -7.25,  11278, false, 248, 270, 0, null, 11100, '2001', false, 0],
  ['8a0103', 'LNI689 ', 'Indonesia',  1700000000, 1700000001,  107.60, -6.90,   3048, false, 160, 90,  0, null,  3000, '2002', false, 0],
  ['8a0104', 'BTK7124', 'Indonesia',  1700000000, 1700000001,  115.18, -8.67,   9144, false, 225, 130, 0, null,  9000, '2003', false, 0],
  ['8a0105', 'IDX302 ', 'Indonesia',  1700000000, 1700000001,  104.70, -2.95,  11582, false, 252, 315, 0, null, 11500, '2004', false, 0],

  // Malaysia
  ['750001', 'MAS370 ', 'Malaysia',   1700000000, 1700000001,  101.69,  3.14,  10668, false, 243, 200, 0, null, 10600, '2100', false, 0],
  ['750002', 'AXM8210', 'Malaysia',   1700000000, 1700000001,  103.98,  1.36,   7620, false, 195, 60,  0, null,  7500, '2101', false, 0],
  ['750003', 'MXD551 ', 'Malaysia',   1700000000, 1700000001,  110.34,  4.89,  11887, false, 258, 85,  0, null, 11800, '2102', false, 0],

  // Singapura
  ['76c001', 'SIA321 ', 'Singapore',  1700000000, 1700000001,  103.98,  1.36,     0,  true,  0,   0,  0, null,     0, '2200', false, 0],
  ['76c002', 'SIA756 ', 'Singapore',  1700000000, 1700000001,  103.85,  1.30,  10972, false, 261, 270, 0, null, 10900, '2201', false, 0],
  ['76c003', 'TGW215 ', 'Singapore',  1700000000, 1700000001,  104.10,  1.45,   8534, false, 210, 40,  0, null,  8500, '2202', false, 0],

  // Thailand
  ['e80001', 'THA661 ', 'Thailand',   1700000000, 1700000001,  100.60, 13.75,  10668, false, 238, 170, 0, null, 10600, '2300', false, 0],
  ['e80002', 'AIQ202 ', 'Thailand',   1700000000, 1700000001,   98.95, 18.80,   6096, false, 181, 220, 0, null,  6000, '2301', false, 0],
  ['e80003', 'NOK4509', 'Thailand',   1700000000, 1700000001,  102.20, 16.45,   9144, false, 218, 310, 0, null,  9000, '2302', false, 0],

  // Filipina
  ['758001', 'PAL804 ', 'Philippines',1700000000, 1700000001,  120.98, 14.52,  10363, false, 229, 350, 0, null, 10300, '2400', false, 0],
  ['758002', 'CEB953 ', 'Philippines',1700000000, 1700000001,  123.89, 10.32,   8229, false, 205, 175, 0, null,  8200, '2401', false, 0],
  ['758003', 'APG6143', 'Philippines',1700000000, 1700000001,  121.03, 13.68,   3658, false, 155, 90,  0, null,  3600, '2402', false, 0],

  // Vietnam
  ['888001', 'HVN211 ', 'Viet Nam',   1700000000, 1700000001,  105.79, 21.02,  11278, false, 247, 195, 0, null, 11200, '2500', false, 0],
  ['888002', 'VJC321 ', 'Viet Nam',   1700000000, 1700000001,  108.21, 16.05,   7010, false, 190, 270, 0, null,  6900, '2501', false, 0],
  ['888003', 'BAV505 ', 'Viet Nam',   1700000000, 1700000001,  106.62, 10.82,   9449, false, 215, 30,  0, null,  9400, '2502', false, 0],

  // Brunei
  ['895001', 'RBA023 ', 'Brunei',     1700000000, 1700000001,  114.93,  4.94,  10058, false, 230, 110, 0, null, 10000, '2600', false, 0],

  // Kamboja
  ['700001', 'KHV305 ', 'Cambodia',   1700000000, 1700000001,  104.92, 11.55,   6706, false, 187, 250, 0, null,  6650, '2700', false, 0],
  ['700002', 'JAA401 ', 'Japan',      1700000000, 1700000001,  105.40, 13.00,  11582, false, 253, 345, 0, null, 11500, '2701', false, 0],

  // Laos
  ['aa0001', 'LAO301 ', 'Laos',       1700000000, 1700000001,  102.61, 17.97,   7620, false, 195, 140, 0, null,  7500, '2800', false, 0],

  // Myanmar
  ['bb0001', 'KBZ442 ', 'Myanmar',    1700000000, 1700000001,   96.15, 16.87,   5486, false, 175, 200, 0, null,  5400, '2900', false, 0],
  ['bb0002', 'MNA201 ', 'Myanmar',    1700000000, 1700000001,   98.33, 21.90,   8839, false, 212, 90,  0, null,  8800, '2901', false, 0],

  // Timor Leste
  ['cc0001', 'AIR902 ', 'Timor-Leste',1700000000, 1700000001,  125.57, -8.55,   4267, false, 163, 70,  0, null,  4200, '3000', false, 0],

  // Transit internasional melintasi ASEAN (posisi di dalam ASEAN)
  ['a1b2c3', 'QFA7  ',  'Australia',  1700000000, 1700000001,  115.86, -1.20,  12192, false, 268, 310, 0, null, 12100, '7700', false, 0],
  ['d4e5f6', 'CCA839 ', 'China',      1700000000, 1700000001,  109.33, 20.10,  11582, false, 255, 200, 0, null, 11500, '0200', false, 0],
  ['112233', 'UAE413 ', 'United Arab Emirates', 1700000000, 1700000001, 103.20, 5.50, 11887, false, 262, 265, 0, null, 11800, '0201', false, 0],
];

export default sampleFlights;
