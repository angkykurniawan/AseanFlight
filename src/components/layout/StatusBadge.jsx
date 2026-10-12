// ============================================================
// StatusBadge.jsx – Badge indikator status data
// ============================================================

const STATUS_CONFIG = {
  live:           { label: 'Live',          cls: 'status-badge--live' },
  'rate-limited': { label: 'Rate-limited',  cls: 'status-badge--rate-limited' },
  offline:        { label: 'Offline',       cls: 'status-badge--offline' },
  demo:           { label: 'Demo data',     cls: 'status-badge--demo' },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;
  return (
    <span
      className={`status-badge ${cfg.cls}`}
      role="status"
      aria-label={`Status data: ${cfg.label}`}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
