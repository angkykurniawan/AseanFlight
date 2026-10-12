// ============================================================
// FilterBar.jsx – Filter negara, status, kategori, tombol refresh
// ============================================================
import { useFlightContext } from '../../context/FlightContext.jsx';
import { ASEAN_COUNTRIES, ALTITUDE_CATEGORIES } from '../../config.js';

/**
 * @param {function} onRefresh   – callback manual refresh
 * @param {boolean}  isRefreshing
 */
export default function FilterBar({ onRefresh, isRefreshing }) {
  const {
    filterCountry, setFilterCountry,
    filterStatus,  setFilterStatus,
    filterAltCategory, setFilterAltCategory,
    clearFilters,
  } = useFlightContext();

  return (
    <div className="filter-bar" role="search" aria-label="Filter penerbangan">
      <span className="filter-bar__label">Filter:</span>

      {/* Negara */}
      <div className="filter-bar__group">
        <label htmlFor="filter-country" className="filter-bar__label" style={{ fontSize: 'var(--font-size-xs)' }}>
          Negara
        </label>
        <select
          id="filter-country"
          className="filter-bar__select"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          aria-label="Filter berdasarkan negara"
        >
          <option value="all">Semua ASEAN</option>
          {ASEAN_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="filter-bar__group">
        <label htmlFor="filter-status" className="filter-bar__label" style={{ fontSize: 'var(--font-size-xs)' }}>
          Status
        </label>
        <select
          id="filter-status"
          className="filter-bar__select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter berdasarkan status"
        >
          <option value="all">Semua</option>
          <option value="airborne">Di Udara</option>
          <option value="ground">Di Darat</option>
        </select>
      </div>

      {/* Kategori Ketinggian */}
      <div className="filter-bar__group">
        <label htmlFor="filter-alt" className="filter-bar__label" style={{ fontSize: 'var(--font-size-xs)' }}>
          Ketinggian
        </label>
        <select
          id="filter-alt"
          className="filter-bar__select"
          value={filterAltCategory}
          onChange={(e) => setFilterAltCategory(e.target.value)}
          aria-label="Filter berdasarkan kategori ketinggian"
        >
          <option value="all">Semua Ketinggian</option>
          {ALTITUDE_CATEGORIES.map((cat) => (
            <option key={cat.label} value={cat.label}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Tombol Reset */}
      <button
        className="filter-bar__btn filter-bar__btn--secondary"
        onClick={clearFilters}
        aria-label="Reset semua filter"
        title="Reset semua filter"
      >
        ↺ Reset
      </button>

      {/* Tombol Refresh */}
      <button
        className="filter-bar__btn"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Perbarui data sekarang"
        title="Perbarui data sekarang"
        style={{ marginLeft: 'auto' }}
      >
        {isRefreshing ? '⟳ Memuat…' : '⟳ Perbarui'}
      </button>
    </div>
  );
}
