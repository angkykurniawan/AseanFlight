// ============================================================
// BulletRow.jsx – Baris bullet bar dengan marker target
// ============================================================

/**
 * @param {string} label
 * @param {number} value      – nilai aktual (0–max)
 * @param {number} target     – nilai target
 * @param {number} max        – nilai maksimal untuk skala (default: target * 1.2)
 * @param {string} valueLabel – teks nilai yang ditampilkan
 * @param {string} targetLabel
 * @param {string} [color]
 * @param {'ok'|'warn'|'crit'} [status]
 */
export default function BulletRow({
  label,
  value,
  target,
  max,
  valueLabel,
  targetLabel,
  color,
  status,
}) {
  const scale  = max ?? target * 1.25;
  const fillPct   = Math.min((value / scale) * 100, 100);
  const targetPct = Math.min((target / scale) * 100, 100);

  const pillText = status === 'ok' ? 'Baik' : status === 'warn' ? 'Perhatian' : 'Kritis';

  const barColor =
    color ??
    (status === 'ok' ? '#00875a' : status === 'warn' ? '#d97706' : '#dc2626');

  return (
    <div className="bullet-row" aria-label={`${label}: ${valueLabel}`}>
      <div className="bullet-row__top">
        <span className="bullet-row__label">{label}</span>
        <span className="bullet-row__value">{valueLabel}</span>
        <span className={`bullet-row__pill bullet-row__pill--${status}`}>
          {pillText}
        </span>
      </div>

      <div
        className="bullet-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={scale}
        aria-label={`${label}: ${valueLabel} dari target ${targetLabel}`}
      >
        <div
          className="bullet-fill"
          style={{ width: `${fillPct}%`, background: barColor }}
        />
        {/* Target marker */}
        <div
          className="bullet-target"
          style={{ left: `${targetPct}%` }}
          aria-hidden="true"
          title={`Target: ${targetLabel}`}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        marginTop: 2,
      }}>
        Target: {targetLabel}
      </div>
    </div>
  );
}
