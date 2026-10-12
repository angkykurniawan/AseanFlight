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

  // Log Aktivitas Real-Time
  const [logs, setLogs] = useState(() => {
    try {
      const saved = sessionStorage.getItem('skywatch_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item) => ({ ...item, timestamp: new Date(item.timestamp) }));
      }
    } catch {
      // Abaikan bila storage gagal diakses
    }
    return [
      {
        id: `log-init-${Date.now()}`,
        timestamp: new Date(),
        level: 'info',
        category: 'system',
        message: 'Sistem SkyWatch ASEAN diinisialisasi',
        details: 'IBM Global AI Builders Challenge · Aviation Track',
      },
    ];
  });

  const addLog = useCallback((entry) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
      level: entry.level || 'info', // 'info' | 'success' | 'warn' | 'error'
      category: entry.category || 'system', // 'api' | 'radar' | 'user' | 'system'
      message: entry.message || '',
      details: entry.details || null,
    };
    setLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 499)];
      try {
        sessionStorage.setItem('skywatch_logs', JSON.stringify(updated.slice(0, 100)));
      } catch {}
      return updated;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    try {
      sessionStorage.removeItem('skywatch_logs');
    } catch {}
  }, []);

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
    logs, addLog, clearLogs,
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
