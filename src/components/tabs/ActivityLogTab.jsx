// ============================================================
// ActivityLogTab.jsx – Tab pemantauan log aktivitas sistem real-time
// ============================================================
import { useState, useMemo, useRef, useEffect } from 'react';
import { useFlightContext } from '../../context/FlightContext.jsx';

function formatTimestamp(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  });
}

function formatDateLong(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const LEVEL_LABELS = {
  all:     'Semua Tingkat',
  info:    'Info',
  success: 'Sukses',
  warn:    'Peringatan',
  error:   'Error',
};

const CATEGORY_LABELS = {
  all:    'Semua Kategori',
  api:    'API & Jaringan',
  radar:  'Radar & Pesawat',
  user:   'Aktivitas Pengguna',
  system: 'Sistem',
};

export default function ActivityLogTab() {
  const { logs, clearLogs, addLog } = useFlightContext();

  const [searchTerm, setSearchTerm]       = useState('');
  const [levelFilter, setLevelFilter]     = useState('all');
  const [catFilter, setCatFilter]         = useState('all');
  const [isAutoScroll, setIsAutoScroll]   = useState(true);
  const [copiedId, setCopiedId]           = useState(null);
  const [statusMsg, setStatusMsg]         = useState('');

  const streamEndRef = useRef(null);

  // Auto-scroll ke paling atas log terbaru bila aktif
  useEffect(() => {
    if (isAutoScroll && streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll]);

  // Statistik jumlah log
  const stats = useMemo(() => {
    let info = 0, success = 0, warn = 0, error = 0;
    for (const log of logs) {
      if (log.level === 'info')    info++;
      else if (log.level === 'success') success++;
      else if (log.level === 'warn')    warn++;
      else if (log.level === 'error')   error++;
    }
    return { total: logs.length, info, success, warn, error };
  }, [logs]);

  // Filter log
  const filteredLogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return logs.filter((log) => {
      if (levelFilter !== 'all' && log.level !== levelFilter) return false;
      if (catFilter !== 'all' && log.category !== catFilter) return false;
      if (q) {
        const text = `${log.message} ${log.details || ''} ${log.category} ${log.level}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [logs, levelFilter, catFilter, searchTerm]);

  // Salin log tunggal
  function handleCopySingle(log) {
    const line = `[${formatDateLong(log.timestamp)}] [${log.level.toUpperCase()}] [${log.category.toUpperCase()}] ${log.message} ${log.details ? `(${log.details})` : ''}`;
    navigator.clipboard.writeText(line).then(() => {
      setCopiedId(log.id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  }

  // Salin semua log terfilter
  function handleCopyAll() {
    if (filteredLogs.length === 0) return;
    const text = filteredLogs
      .map((l) => `[${formatDateLong(l.timestamp)}] [${l.level.toUpperCase()}] [${l.category.toUpperCase()}] ${l.message} ${l.details ? `(${l.details})` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setStatusMsg('Semua log tersalin ke clipboard!');
      setTimeout(() => setStatusMsg(''), 2500);
    });
  }

  // Ekspor log ke file JSON
  function handleExportJson() {
    if (logs.length === 0) return;
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skywatch-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog({
      level: 'info',
      category: 'user',
      message: `Log aktivitas diekspor ke file JSON (${logs.length} entri)`,
    });
  }

  // Ekspor log ke file teks .log
  function handleExportTxt() {
    if (logs.length === 0) return;
    const lines = logs.map(
      (l) => `[${formatDateLong(l.timestamp)}] [${l.level.toUpperCase()}] [${l.category.toUpperCase()}] ${l.message} ${l.details ? `| Details: ${l.details}` : ''}`
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skywatch-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.log`;
    a.click();
    URL.revokeObjectURL(url);
    addLog({
      level: 'info',
      category: 'user',
      message: `Log aktivitas diekspor ke format teks .log (${logs.length} entri)`,
    });
  }

  // Bersihkan log
  function handleClear() {
    if (window.confirm('Bersihkan seluruh riwayat log aktivitas?')) {
      clearLogs();
      setStatusMsg('Riwayat log berhasil dibersihkan.');
      setTimeout(() => setStatusMsg(''), 2500);
    }
  }

  return (
    <div
      id="panel-logs"
      role="tabpanel"
      aria-labelledby="tab-logs"
      className="activity-log-tab"
    >
      {/* Header Tab */}
      <div className="activity-log-tab__header">
        <div>
          <h1 className="section-title">Log Aktivitas Sistem</h1>
          <p className="section-subtitle">
            Pemantauan langsung event OpenSky API, lalu-lintas radar penerbangan ASEAN, dan interaksi pengguna.
          </p>
        </div>

        {statusMsg && (
          <div className="activity-log-tab__toast" role="status" aria-live="polite">
            ✓ {statusMsg}
          </div>
        )}
      </div>

      {/* Grid Statistik Ringkasan */}
      <div className="log-stats-grid">
        <div className="log-stat-card log-stat-card--total">
          <div className="log-stat-card__icon" aria-hidden="true">📜</div>
          <div>
            <div className="log-stat-card__value">{stats.total}</div>
            <div className="log-stat-card__label">Total Event</div>
          </div>
        </div>

        <div className="log-stat-card log-stat-card--success">
          <div className="log-stat-card__icon" aria-hidden="true">✅</div>
          <div>
            <div className="log-stat-card__value">{stats.success}</div>
            <div className="log-stat-card__label">Sukses</div>
          </div>
        </div>

        <div className="log-stat-card log-stat-card--info">
          <div className="log-stat-card__icon" aria-hidden="true">ℹ️</div>
          <div>
            <div className="log-stat-card__value">{stats.info}</div>
            <div className="log-stat-card__label">Info</div>
          </div>
        </div>

        <div className="log-stat-card log-stat-card--warn">
          <div className="log-stat-card__icon" aria-hidden="true">⚠️</div>
          <div>
            <div className="log-stat-card__value">{stats.warn}</div>
            <div className="log-stat-card__label">Peringatan</div>
          </div>
        </div>

        <div className="log-stat-card log-stat-card--error">
          <div className="log-stat-card__icon" aria-hidden="true">❌</div>
          <div>
            <div className="log-stat-card__value">{stats.error}</div>
            <div className="log-stat-card__label">Error / Gagal</div>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card log-container-card">
        {/* Toolbar Kontrol */}
        <div className="log-toolbar">
          {/* Search bar */}
          <div className="log-toolbar__search">
            <span className="log-toolbar__search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              className="log-toolbar__input"
              placeholder="Cari pesan log, callsign, latency, atau status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Cari log aktivitas"
            />
            {searchTerm && (
              <button
                type="button"
                className="log-toolbar__clear-btn"
                onClick={() => setSearchTerm('')}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdown: Level & Kategori */}
          <div className="log-toolbar__filters">
            <select
              className="log-toolbar__select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              aria-label="Filter berdasarkan level log"
            >
              {Object.entries(LEVEL_LABELS).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>

            <select
              className="log-toolbar__select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              aria-label="Filter berdasarkan kategori log"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="log-toolbar__actions">
            <button
              type="button"
              className={`log-btn log-btn--toggle ${isAutoScroll ? 'log-btn--active' : ''}`}
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              title={isAutoScroll ? 'Auto-scroll aktif (klik untuk jeda)' : 'Auto-scroll dijeda (klik untuk aktifkan)'}
            >
              {isAutoScroll ? '● Auto-scroll: ON' : '○ Auto-scroll: OFF'}
            </button>

            <button
              type="button"
              className="log-btn"
              onClick={handleCopyAll}
              disabled={filteredLogs.length === 0}
              title="Salin seluruh log terfilter ke clipboard"
            >
              📋 Salin
            </button>

            <button
              type="button"
              className="log-btn"
              onClick={handleExportJson}
              disabled={logs.length === 0}
              title="Unduh log dalam format JSON"
            >
              📥 JSON
            </button>

            <button
              type="button"
              className="log-btn"
              onClick={handleExportTxt}
              disabled={logs.length === 0}
              title="Unduh log dalam format text .log"
            >
              📄 .LOG
            </button>

            <button
              type="button"
              className="log-btn log-btn--danger"
              onClick={handleClear}
              disabled={logs.length === 0}
              title="Kosongkan log"
            >
              🗑️ Bersihkan
            </button>
          </div>
        </div>

        {/* Feed Log Stream */}
        <div className="log-stream-wrap">
          <div ref={streamEndRef} tabIndex={-1} aria-hidden="true" />

          {filteredLogs.length === 0 ? (
            <div className="log-empty-state">
              <div className="log-empty-state__icon">📭</div>
              <div className="log-empty-state__title">Tidak ada log aktivitas yang cocok</div>
              <p className="log-empty-state__desc">
                {searchTerm || levelFilter !== 'all' || catFilter !== 'all'
                  ? 'Coba sesuaikan kata kunci pencarian atau ubah filter di toolbar atas.'
                  : 'Belum ada rekaman aktivitas sistem saat ini.'}
              </p>
            </div>
          ) : (
            <div className="log-stream-list" role="feed" aria-label="Aliran log aktivitas">
              {filteredLogs.map((log) => {
                const isCopied = copiedId === log.id;
                return (
                  <div
                    key={log.id}
                    className={`log-row log-row--${log.level}`}
                    role="article"
                  >
                    {/* Kolom Waktu */}
                    <div className="log-row__time" title={formatDateLong(log.timestamp)}>
                      {formatTimestamp(log.timestamp)}
                    </div>

                    {/* Kolom Level Badge */}
                    <div className="log-row__level">
                      <span className={`log-badge log-badge--${log.level}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>

                    {/* Kolom Kategori Badge */}
                    <div className="log-row__cat">
                      <span className={`log-cat-badge log-cat-badge--${log.category}`}>
                        {log.category.toUpperCase()}
                      </span>
                    </div>

                    {/* Kolom Isi Pesan & Detail */}
                    <div className="log-row__content">
                      <span className="log-row__message">{log.message}</span>
                      {log.details && (
                        <span className="log-row__details">
                          {log.details}
                        </span>
                      )}
                    </div>

                    {/* Tombol Salin Cepat */}
                    <div className="log-row__action">
                      <button
                        type="button"
                        className="log-row__copy-btn"
                        onClick={() => handleCopySingle(log)}
                        title="Salin baris ini"
                        aria-label="Salin baris log ini"
                      >
                        {isCopied ? '✓' : '❐'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="log-container-card__footer">
          <span>Menampilkan <strong>{filteredLogs.length}</strong> dari <strong>{logs.length}</strong> entri aktivitas</span>
          <span className="log-container-card__footer-hint">Siklus update otomatis mengikuti interval radar (60 detik)</span>
        </div>
      </div>
    </div>
  );
}
