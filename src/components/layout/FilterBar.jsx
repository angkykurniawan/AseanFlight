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
    addLog,
  } = useFlightContext();

  function handleCountryChange(e) {
    const val = e.target.value;
    setFilterCountry(val);
    const cName = val === 'all' ? 'Semua ASEAN' : (ASEAN_COUNTRIES.find((c) => c.code === val)?.name || val);
    addLog({
      level: 'info',
      category: 'user',
      message: `Filter negara diubah ke: ${cName}`,
    });
  }

  function handleStatusChange(e) {
    const val = e.target.value;
    setFilterStatus(val);
    const sName = val === 'all' ? 'Semua' : val === 'airborne' ? 'Di Udara' : 'Di Darat';
    addLog({
      level: 'info',
      category: 'user',
      message: `Filter status penerbangan diubah ke: ${sName}`,
    });
  }

  function handleAltChange(e) {
    const val = e.target.value;
    setFilterAltCategory(val);
    addLog({
      level: 'info',
      category: 'user',
      message: `Filter ketinggian diubah ke: ${val === 'all' ? 'Semua Ketinggian' : val}`,
    });
  }

  function handleResetFilters() {
    clearFilters();
    addLog({
      level: 'info',
      category: 'user',
      message: 'Semua filter penerbangan di-reset ke nilai default',
    });
  }

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
          onChange={handleCountryChange}
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
          onChange={handleStatusChange}
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
          onChange={handleAltChange}
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
        onClick={handleResetFilters}
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
