// ============================================================
// DataTab.jsx – Tabel pesawat yang bisa diurutkan (maks 100 baris)
// ============================================================
import { useState, useMemo } from 'react';
import { DATA_TAB_MAX_ROWS, COUNTRY_NAME_BY_CODE } from '../../config.js';
import { formatAltitude, formatSpeed } from '../../utils/convert.js';

const COLUMNS = [
  { key: 'callsign',        label: 'Callsign' },
  { key: 'icao24',          label: 'ICAO24' },
  { key: 'originCountry',   label: 'Negara Asal' },
  { key: 'airspaceCountry', label: 'Wilayah Udara' },
  { key: 'altitudeM',       label: 'Ketinggian' },
  { key: 'velocityKmh',     label: 'Kecepatan' },
  { key: 'trueTrack',       label: 'Arah (°)' },
  { key: 'onGround',        label: 'Status' },
  { key: 'altCategory',     label: 'Kategori' },
];

export default function DataTab({ allFlights }) {
  const [sortKey, setSortKey]   = useState('callsign');
  const [sortDir, setSortDir]   = useState('asc');

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = useMemo(() => {
    const arr = [...allFlights].sort((a, b) => {
      let av = a[sortKey] ?? '';
      let bv = b[sortKey] ?? '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr.slice(0, DATA_TAB_MAX_ROWS);
  }, [allFlights, sortKey, sortDir]);

  const sortArrow = (key) => key === sortKey ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div
      id="panel-data"
      role="tabpanel"
      aria-labelledby="tab-data"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
    >
      <div>
        <h1 className="section-title">Data Pesawat</h1>
        <p className="section-subtitle">
          Menampilkan maks {DATA_TAB_MAX_ROWS} pesawat. Klik judul kolom untuk mengurutkan.
          Total: <strong>{allFlights.length}</strong> pesawat.
        </p>
      </div>

      <div className="data-table-wrap">
        <table className="data-table" aria-label="Tabel data pesawat">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  aria-sort={
                    col.key === sortKey
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  scope="col"
                >
                  <span>{col.label}{sortArrow(col.key)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="data-table__empty">
                  Tidak ada data pesawat.
                </td>
              </tr>
            )}
            {sorted.map((f) => (
              <tr key={f.icao24}>
                <td>{f.callsign}</td>
                <td style={{ fontFamily: 'monospace' }}>{f.icao24.toUpperCase()}</td>
                <td>{f.originCountry}</td>
                <td>
                  {f.airspaceCountry
                    ? `${COUNTRY_NAME_BY_CODE[f.airspaceCountry] ?? f.airspaceCountry} (${f.airspaceCountry})`
                    : '—'}
                </td>
                <td>{formatAltitude(f.altitudeM)}</td>
                <td>{formatSpeed(f.velocityKmh)}</td>
                <td>{f.trueTrack ?? '—'}°</td>
                <td>
                  {f.onGround
                    ? <span className="data-table__status-on-ground">Di Darat</span>
                    : <span className="data-table__status-airborne">Di Udara</span>}
                </td>
                <td>{f.altCategory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
