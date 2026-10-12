// ============================================================
// App.jsx – Root komponen aplikasi SkyWatch ASEAN
// ============================================================
import { useRef, useState } from 'react';
import { useFlightContext } from './context/FlightContext.jsx';
import { useOpenSky       } from './hooks/useOpenSky.js';
import { useFlightHistory } from './hooks/useFlightStats.js';
import Header       from './components/layout/Header.jsx';
import OverviewTab  from './components/tabs/OverviewTab.jsx';
import LiveMapTab   from './components/tabs/LiveMapTab.jsx';
import CountriesTab from './components/tabs/CountriesTab.jsx';
import DataTab      from './components/tabs/DataTab.jsx';
import ActivityLogTab from './components/tabs/ActivityLogTab.jsx';

export default function App() {
  const { flights, activeTab } = useFlightContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Riwayat refresh untuk sparkline dan column bar chart
  const [history, pushHistory] = useFlightHistory();

  // onRefreshRef diteruskan ke useOpenSky agar setiap kali data datang
  // langsung didorong ke riwayat tanpa stale closure
  const onRefreshRef = useRef(null);
  onRefreshRef.current = (newFlights) => {
    if (newFlights) pushHistory(newFlights);
    setIsRefreshing(false);
  };

  // Inisialisasi polling
  const { manualRefresh } = useOpenSky(onRefreshRef);

  function handleRefresh() {
    setIsRefreshing(true);
    manualRefresh();
  }

  return (
    <>
      <Header />
      <main className="app-main" id="main-content">
        {/* Semua tab di-render di sini; tab aktif yang visible */}
        <div style={{ display: activeTab === 'overview'  ? 'contents' : 'none' }}>
          <OverviewTab
            allFlights={flights}
            history={history}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
        <div style={{ display: activeTab === 'livemap'   ? 'contents' : 'none' }}>
          <LiveMapTab
            allFlights={flights}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
        <div style={{ display: activeTab === 'countries' ? 'contents' : 'none' }}>
          <CountriesTab allFlights={flights} />
        </div>
        <div style={{ display: activeTab === 'data'      ? 'contents' : 'none' }}>
          <DataTab allFlights={flights} />
        </div>
        <div style={{ display: activeTab === 'logs'      ? 'contents' : 'none' }}>
          <ActivityLogTab />
        </div>
      </main>
    </>
  );
}
