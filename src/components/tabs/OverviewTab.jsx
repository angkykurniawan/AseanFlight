// ============================================================
// OverviewTab.jsx – Tab Ikhtisar (KPI + Peta + Scorecard + Charts)
// ============================================================
import KpiRow            from '../kpi/KpiRow.jsx';
import FlightMap         from '../map/FlightMap.jsx';
import Scorecard         from '../scorecard/Scorecard.jsx';
import HorizontalBarChart from '../charts/HorizontalBarChart.jsx';
import ColumnBarChart    from '../charts/ColumnBarChart.jsx';
import FilterBar         from '../layout/FilterBar.jsx';
import WarningBanner     from '../layout/WarningBanner.jsx';
import { useFlightContext } from '../../context/FlightContext.jsx';
import { useFlightStats  } from '../../hooks/useFlightStats.js';
import { useMemo }         from 'react';

/**
 * @param {object[]} allFlights  – semua pesawat dari context
 * @param {object[]} history
 * @param {function} onRefresh
 * @param {boolean}  isRefreshing
 */
export default function OverviewTab({ allFlights, history, onRefresh, isRefreshing }) {
  const {
    filterCountry, filterStatus, filterAltCategory,
    selectedFlight, setSelectedFlight,
    rateLimitBanner, countdown, dataStatus,
  } = useFlightContext();

  // Filter sisi klien
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

  const stats = useFlightStats(filteredFlights);
  const allStats = useFlightStats(allFlights);

  return (
    <div
      id="panel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
    >
      {/* Judul seksi */}
      <div>
        <h1 className="section-title">Ringkasan Penerbangan ASEAN</h1>
        <p className="section-subtitle">
          Memantau wilayah udara 11 negara ASEAN secara real-time dari OpenSky Network.
        </p>
      </div>

      {/* Warning banner */}
      <WarningBanner visible={rateLimitBanner} countdown={countdown} />

      {/* Filter Bar */}
      <FilterBar onRefresh={onRefresh} isRefreshing={isRefreshing} />

      {/* KPI Row */}
      <KpiRow stats={stats} history={history} />

      {/* Panel utama: Peta + Scorecard */}
      <div className="main-panel">
        <FlightMap
          flights={filteredFlights}
          filterCountry={filterCountry}
          selectedFlight={selectedFlight}
          onSelectFlight={setSelectedFlight}
        />
        <Scorecard stats={allStats} dataStatus={dataStatus} />
      </div>

      {/* Baris chart bawah */}
      <div className="charts-row">
        <HorizontalBarChart
          title="Pesawat per Negara Wilayah Udara ASEAN"
          data={allStats.byCountry.map((c) => ({ label: c.name, count: c.count }))}
        />
        <HorizontalBarChart
          title="Pesawat per Kategori Ketinggian"
          data={allStats.byAltCategory
            .filter((c) => c.count > 0)
            .map((c) => ({ label: c.label, count: c.count, color: c.color }))}
        />
        <ColumnBarChart
          title="Pesawat Terpantau per Interval Refresh"
          history={history}
        />
      </div>
    </div>
  );
}
