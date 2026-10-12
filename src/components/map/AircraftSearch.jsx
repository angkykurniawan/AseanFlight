// ============================================================
// AircraftSearch.jsx – Pencarian callsign/ICAO24 dengan debounce
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useFlightContext } from '../../context/FlightContext.jsx';

/**
 * @param {object[]} flights         – daftar pesawat terkini
 * @param {function} onSelectFlight  – dipanggil dengan objek flight terpilih
 */
export default function AircraftSearch({ flights, onSelectFlight }) {
  const { addLog }            = useFlightContext();
  const [query, setQuery]     = useState('');
  const [open, setOpen]       = useState(false);
  const debouncedQuery        = useDebounce(query, 350);
  const wrapRef               = useRef(null);

  // Filter berdasarkan query
  const results =
    debouncedQuery.length >= 2
      ? flights
          .filter((f) => {
            const q = debouncedQuery.toLowerCase();
            return (
              f.callsign.toLowerCase().includes(q) ||
              f.icao24.toLowerCase().includes(q)
            );
          })
          .slice(0, 10)
      : [];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(flight) {
    const cs = flight.callsign !== 'N/A' ? flight.callsign : flight.icao24;
    setQuery(cs);
    setOpen(false);
    onSelectFlight(flight);
    addLog({
      level: 'info',
      category: 'radar',
      message: `Pesawat dipilih pada radar: ${cs} (${flight.originCountry})`,
      details: `Ketinggian: ${flight.altitudeM}m · Kecepatan: ${flight.velocityKmh} km/h · Wilayah: ${flight.airspaceCountry || 'Internasional'}`,
    });
  }

  function handleKeyDown(e, flight) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(flight);
    }
  }

  return (
    <div className="aircraft-search" ref={wrapRef}>
      <span className="aircraft-search__icon" aria-hidden="true">🔍</span>
      <input
        type="search"
        className="aircraft-search__input"
        placeholder="Cari callsign / ICAO24…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        aria-label="Cari pesawat berdasarkan callsign atau kode ICAO24"
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul
          className="aircraft-search__results"
          role="listbox"
          aria-label="Hasil pencarian pesawat"
        >
          {results.map((f) => (
            <li
              key={f.icao24}
              className="aircraft-search__item"
              role="option"
              aria-selected="false"
              tabIndex={0}
              onClick={() => handleSelect(f)}
              onKeyDown={(e) => handleKeyDown(e, f)}
            >
              <span className="aircraft-search__item-call">{f.callsign}</span>
              <span className="aircraft-search__item-icao">{f.icao24.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
