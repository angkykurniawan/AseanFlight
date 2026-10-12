// ============================================================
// Scorecard.jsx – Panel scorecard dengan 6 bullet bar
// ============================================================
import BulletRow from './BulletRow.jsx';
import { SCORECARD_TARGETS, ASEAN_COUNTRIES } from '../../config.js';

function scorecardStatus(value, target) {
  const ratio = value / target;
  if (ratio >= 0.9) return 'ok';
  if (ratio >= 0.6) return 'warn';
  return 'crit';
}

/**
 * @param {object} stats  – dari useFlightStats
 * @param {string} dataStatus – 'live' | 'rate-limited' | 'offline' | 'demo'
 */
export default function Scorecard({ stats, dataStatus }) {
  const T = SCORECARD_TARGETS;

  const avgAltKm = stats.avgAltitudeM != null
    ? Math.round(stats.avgAltitudeM / 100) / 10  // 1 desimal km
    : 0;
  const targetAltKm = T.avgAltitudeM / 1000;

  const airbornePercent = stats.total > 0
    ? Math.round((stats.airborne / stats.total) * 100)
    : 0;

  const apiHealth = dataStatus === 'live' ? 100
    : dataStatus === 'demo' ? 50
    : dataStatus === 'rate-limited' ? 30
    : 0;

  return (
    <div className="scorecard" aria-label="Scorecard kinerja">
      <div className="scorecard__title">📊 Scorecard Kinerja</div>

      <BulletRow
        label="Ketinggian Rata-rata"
        value={avgAltKm}
        target={targetAltKm}
        max={targetAltKm * 1.3}
        valueLabel={`${avgAltKm} km`}
        targetLabel={`${targetAltKm} km`}
        status={scorecardStatus(avgAltKm, targetAltKm)}
      />

      <BulletRow
        label="Kecepatan Rata-rata"
        value={stats.avgSpeedKmh ?? 0}
        target={T.avgSpeedKmh}
        max={T.avgSpeedKmh * 1.25}
        valueLabel={`${stats.avgSpeedKmh ?? 0} km/j`}
        targetLabel={`${T.avgSpeedKmh} km/j`}
        status={scorecardStatus(stats.avgSpeedKmh ?? 0, T.avgSpeedKmh)}
      />

      <BulletRow
        label="% Pesawat Di Udara"
        value={airbornePercent}
        target={T.airbornePercent}
        max={100}
        valueLabel={`${airbornePercent}%`}
        targetLabel={`${T.airbornePercent}%`}
        status={scorecardStatus(airbornePercent, T.airbornePercent)}
      />

      <BulletRow
        label="Cakupan Negara"
        value={stats.countryCoverage}
        target={T.countryCoverage}
        max={ASEAN_COUNTRIES.length}
        valueLabel={`${stats.countryCoverage}/${ASEAN_COUNTRIES.length} negara`}
        targetLabel={`${T.countryCoverage} negara`}
        status={scorecardStatus(stats.countryCoverage, T.countryCoverage)}
      />

      <BulletRow
        label="Kelengkapan Callsign"
        value={stats.callsignCompletenessPercent}
        target={T.callsignCompleteness}
        max={100}
        valueLabel={`${stats.callsignCompletenessPercent}%`}
        targetLabel={`${T.callsignCompleteness}%`}
        status={scorecardStatus(stats.callsignCompletenessPercent, T.callsignCompleteness)}
      />

      <BulletRow
        label="Kesehatan API"
        value={apiHealth}
        target={T.apiHealthPercent}
        max={100}
        valueLabel={`${apiHealth}%`}
        targetLabel={`${T.apiHealthPercent}%`}
        status={scorecardStatus(apiHealth, T.apiHealthPercent)}
      />
    </div>
  );
}
