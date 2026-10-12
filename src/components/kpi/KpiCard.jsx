// ============================================================
// KpiCard.jsx – Kartu KPI dengan nilai, delta, dan sparkline
// ============================================================
import Sparkline from './Sparkline.jsx';

/**
 * @param {string}   label
 * @param {string}   value        – nilai yang ditampilkan (string)
 * @param {string}   [unit]       – satuan opsional di samping nilai
 * @param {number}   [delta]      – selisih dari pembacaan sebelumnya
 * @param {string}   [deltaLabel] – teks delta opsional
 * @param {number[]} [history]    – array untuk sparkline
 * @param {string}   [sparkColor]
 * @param {string}   [sparkLabel]
 */
export default function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  history = [],
  sparkColor = '#1a2b4a',
  sparkLabel,
}) {
  // Tentukan arah delta
  const deltaDir = delta == null ? null : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const deltaSign = deltaDir === 'up' ? '▲' : deltaDir === 'down' ? '▼' : '–';

  return (
    <article className="kpi-card" aria-label={`KPI: ${label}`}>
      <div className="kpi-card__label">{label}</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <div className="kpi-card__value">{value ?? '—'}</div>
        {unit && <div className="kpi-card__unit">{unit}</div>}
      </div>

      <div className="kpi-card__footer">
        {deltaDir !== null && (
          <span className={`kpi-card__delta kpi-card__delta--${deltaDir}`}>
            {deltaSign}{' '}
            {deltaLabel ?? (delta != null ? Math.abs(delta) : '')}
          </span>
        )}
        {history.length >= 2 && (
          <Sparkline
            data={history}
            width={80}
            height={28}
            color={sparkColor}
            label={sparkLabel ?? `Riwayat ${label}`}
          />
        )}
      </div>
    </article>
  );
}
