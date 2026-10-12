// ============================================================
// CountriesTab.jsx – Grid 11 kartu ringkasan negara ASEAN
// ============================================================
import { useFlightContext } from '../../context/FlightContext.jsx';
import { useFlightStats   } from '../../hooks/useFlightStats.js';

export default function CountriesTab({ allFlights }) {
  const { setFilterCountry, setActiveTab } = useFlightContext();
  const stats = useFlightStats(allFlights);

  const maxCount = Math.max(...stats.byCountry.map((c) => c.count), 1);

  function handleCountryClick(code) {
    setFilterCountry(code);
    setActiveTab('livemap');
  }

  return (
    <div
      id="panel-countries"
      role="tabpanel"
      aria-labelledby="tab-countries"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
    >
      <div>
        <h1 className="section-title">Negara ASEAN</h1>
        <p className="section-subtitle">
          Klik kartu negara untuk menerapkan filter dan melihat di Peta Live.
        </p>
      </div>

      <div className="countries-grid">
        {stats.byCountry.map((country) => {
          const barPct = Math.round((country.count / maxCount) * 100);
          return (
            <div
              key={country.code}
              className="country-card"
              role="button"
              tabIndex={0}
              aria-label={`${country.name}: ${country.count} pesawat. Klik untuk filter.`}
              onClick={() => handleCountryClick(country.code)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCountryClick(country.code);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="country-card__name">{country.name}</div>
                <span style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-surface-2)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)',
                }}>
                  {country.code}
                </span>
              </div>

              <div>
                <div className="country-card__count">{country.count}</div>
                <div className="country-card__label">pesawat terdeteksi</div>
              </div>

              <div className="country-card__bar-track">
                <div
                  className="country-card__bar-fill"
                  style={{ width: `${barPct}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
