// ============================================================
// FlightContext.jsx – Context global untuk data penerbangan
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react';

/** @type {React.Context} */
const FlightContext = createContext(null);

/**
 * Provider yang membungkus seluruh aplikasi.
 * Menyediakan:
 *   - flights: array pesawat hasil parse terkini
 *   - dataStatus: 'live' | 'rate-limited' | 'offline' | 'demo'
 *   - lastUpdated: Date | null
 *   - countdown: detik sampai refresh berikutnya
 *   - rateLimitBanner: boolean
 *   - filterCountry: string kode negara | 'all'
 *   - filterStatus: 'all' | 'airborne' | 'ground'
 *   - filterAltCategory: string | 'all'
 *   - selectedFlight: object | null (untuk flyTo dari pencarian)
 *   - activeTab: string
 *   - setFlights, setDataStatus, setLastUpdated, setCountdown,
 *     setRateLimitBanner, setFilterCountry, setFilterStatus,
 *     setFilterAltCategory, setSelectedFlight, setActiveTab
 */
export function FlightProvider({ children }) {
  const [flights, setFlights]               = useState([]);
  const [dataStatus, setDataStatus]         = useState('offline');
  const [lastUpdated, setLastUpdated]       = useState(null);
  const [countdown, setCountdown]           = useState(0);
  const [rateLimitBanner, setRateLimitBanner] = useState(false);
  const [filterCountry, setFilterCountry]   = useState('all');
  const [filterStatus, setFilterStatus]     = useState('all');
  const [filterAltCategory, setFilterAltCategory] = useState('all');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [activeTab, setActiveTab]           = useState('overview');

  const clearFilters = useCallback(() => {
    setFilterCountry('all');
    setFilterStatus('all');
    setFilterAltCategory('all');
  }, []);

  const value = {
    flights, setFlights,
    dataStatus, setDataStatus,
    lastUpdated, setLastUpdated,
    countdown, setCountdown,
    rateLimitBanner, setRateLimitBanner,
    filterCountry, setFilterCountry,
    filterStatus, setFilterStatus,
    filterAltCategory, setFilterAltCategory,
    selectedFlight, setSelectedFlight,
    activeTab, setActiveTab,
    clearFilters,
  };

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  );
}

/** Hook untuk mengonsumsi context. */
export function useFlightContext() {
  const ctx = useContext(FlightContext);
  if (!ctx) throw new Error('useFlightContext harus dipakai di dalam FlightProvider');
  return ctx;
}

export default FlightContext;
