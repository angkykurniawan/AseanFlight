// ============================================================
// LiveMapTab.jsx – Tab Peta Live penuh
// ============================================================
import { useMemo } from 'react';
import FlightMap     from '../map/FlightMap.jsx';
import FilterBar     from '../layout/FilterBar.jsx';
import WarningBanner from '../layout/WarningBanner.jsx';
import { useFlightContext } from '../../context/FlightContext.jsx';

export default function LiveMapTab({ allFlights, onRefresh, isRefreshing }) {
  const {
    filterCountry, filterStatus, filterAltCategory,
    selectedFlight, setSelectedFlight,
    rateLimitBanner, countdown,
  } = useFlightContext();

  const filteredFlights = useMemo(() => {
    let result = allFlights;
    if (filterCountry !== 'all') {
      result = result.filter((f) => f.airspaceCountry === filterCountry);
    }
    if (filterStatus === 'airborne') {
      result = result.filter((f) => !f.onGround);
    } else if (filterStatus === 'ground') {
      result = result.filter((f) => f.onGround);
    }
    if (filterAltCategory !== 'all') {
      result = result.filter((f) => f.altCategory === filterAltCategory);
    }
    return result;
  }, [allFlights, filterCountry, filterStatus, filterAltCategory]);

  return (
    <div
      id="panel-livemap"
      role="tabpanel"
      aria-labelledby="tab-livemap"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      <div>
        <h1 className="section-title">Peta Live Wilayah Udara ASEAN</h1>
        <p className="section-subtitle">Posisi real-time semua pesawat yang terdeteksi di 11 negara ASEAN.</p>
      </div>

      <WarningBanner visible={rateLimitBanner} countdown={countdown} />
      <FilterBar onRefresh={onRefresh} isRefreshing={isRefreshing} />

      <div style={{ height: '65vh', minHeight: 420 }}>
        <FlightMap
          flights={filteredFlights}
          filterCountry={filterCountry}
          selectedFlight={selectedFlight}
          onSelectFlight={setSelectedFlight}
        />
      </div>
    </div>
  );
}
