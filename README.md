# SkyWatch ASEAN ✈

**Dashboard real-time pemantauan lalu lintas udara wilayah ASEAN**  
*IBM Global AI Builders Challenge – Aviation Track*

---

## Prasyarat

- **Node.js ≥ 18** dan **npm ≥ 9**
- Koneksi internet (untuk data live dari OpenSky Network)

---

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka browser di [http://localhost:5173](http://localhost:5173).

---

## Fitur Utama

| Fitur | Keterangan |
|---|---|
| **Data Live** | Polling otomatis 60 detik ke OpenSky Network API (tanpa API key) |
| **11 Negara ASEAN** | Indonesia, Malaysia, Singapura, Thailand, Filipina, Vietnam, Brunei, Kamboja, Laos, Myanmar, Timor Leste |
| **Filter Sisi Klien** | Satu request → filter di klien berdasarkan bounding box perkiraan per negara |
| **Peta Interaktif** | React-Leaflet CartoDB Positron, marker SVG berotasi, popup detail |
| **Pencarian Pesawat** | Debounced search callsign/ICAO24 dengan flyTo |
| **6 KPI Card** | Total, Di Udara, Ketinggian, Kecepatan, Tercepat, Tertinggi + sparkline |
| **Scorecard Bullet Bar** | 6 indikator kinerja vs target (SVG/CSS murni) |
| **Chart Murni** | Bar horizontal & kolom dengan SVG/CSS, tanpa library chart |
| **Backoff HTTP 429** | Jeda 60→120→300 detik + banner peringatan |
| **Fallback Demo** | ~30 pesawat sampel bila API tidak terjangkau |
| **Responsif** | KPI 6→3→2 kolom, WCAG AA, aria-label |

---

## Struktur Proyek

```
src/
├── main.jsx
├── App.jsx
├── config.js                      # Semua konstanta
├── context/FlightContext.jsx
├── hooks/
│   ├── useOpenSky.js              # Polling + backoff + fallback
│   ├── useDebounce.js
│   └── useFlightStats.js
├── utils/
│   ├── geo.js                     # getAseanCountry(lat, lon)
│   ├── convert.js                 # m/s → km/h, m → ft, dll.
│   └── parse.js                   # Parsing state vector OpenSky
├── data/sampleFlights.js
├── styles/global.css
└── components/
    ├── layout/  Header, NavPills, StatusBadge, WarningBanner, FilterBar
    ├── kpi/     KpiCard, KpiRow, Sparkline
    ├── map/     FlightMap, AircraftMarker, AircraftSearch
    ├── scorecard/ Scorecard, BulletRow
    ├── charts/  HorizontalBarChart, ColumnBarChart
    └── tabs/    OverviewTab, LiveMapTab, CountriesTab, DataTab
```

---

## Catatan API

- OpenSky Network (pengguna anonim): **maks ~400 request/hari**
- Satu request mencakup bounding box seluruh ASEAN; filter dilakukan di sisi klien
- Bila HTTP 429 diterima → polling dijeda otomatis (backoff 60/120/300 detik)
- Bila jaringan tidak tersedia → tampilkan data demo (~30 pesawat sampel)
- **Tidak ada API key yang disimpan di kode maupun storage**

---

## Teknologi

- React 18 (functional components + hooks)
- Vite 5
- Leaflet 1.9.4 + React-Leaflet 4.2.1
- CSS murni dengan Custom Properties
- SVG murni untuk semua chart dan marker

---

*Dibuat untuk IBM Global AI Builders Challenge 2025 – Aviation Track*
