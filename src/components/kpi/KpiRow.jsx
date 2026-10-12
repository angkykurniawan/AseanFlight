// ============================================================
// KpiRow.jsx – Baris 6 KPI card
// ============================================================
import KpiCard from './KpiCard.jsx';

/**
 * @param {object}   stats    – dari useFlightStats
 * @param {object[]} history  – array snapshot dari useFlightHistory
 */
export default function KpiRow({ stats, history }) {
  const prev = history.length >= 2 ? history[history.length - 2] : null;
  const curr = history.length >= 1 ? history[history.length - 1] : null;

  const deltaTotal   = curr && prev ? curr.total   - prev.total   : null;
  const deltaAirborne = curr && prev ? curr.airborne - prev.airborne : null;
  const deltaAlt     = curr && prev ? curr.avgAlt   - prev.avgAlt   : null;
  const deltaSpeed   = curr && prev ? curr.avgSpeed - prev.avgSpeed : null;

  const totalHistory   = history.map((h) => h.total);
  const airborneHistory = history.map((h) => h.airborne);
  const altHistory     = history.map((h) => h.avgAlt);
  const speedHistory   = history.map((h) => h.avgSpeed);

  return (
    <div className="kpi-row" aria-label="Ringkasan KPI">
      <KpiCard
        label="Total Pesawat ASEAN"
        value={stats.total}
        delta={deltaTotal}
        history={totalHistory}
        sparkLabel="Riwayat total pesawat"
      />
      <KpiCard
        label="Di Udara"
        value={stats.airborne}
        delta={deltaAirborne}
        history={airborneHistory}
        sparkLabel="Riwayat pesawat di udara"
        sparkColor="#00875a"
      />
      <KpiCard
        label="Ketinggian Rata-rata"
        value={stats.avgAltitudeM != null
          ? Math.round(stats.avgAltitudeM / 1000 * 10) / 10
          : '—'}
        unit="km"
        delta={deltaAlt != null ? Math.round(deltaAlt) : null}
        deltaLabel={deltaAlt != null ? `${Math.abs(Math.round(deltaAlt))} m` : null}
        history={altHistory}
        sparkLabel="Riwayat ketinggian rata-rata"
        sparkColor="#2563eb"
      />
      <KpiCard
        label="Kecepatan Rata-rata"
        value={stats.avgSpeedKmh ?? '—'}
        unit="km/j"
        delta={deltaSpeed != null ? Math.round(deltaSpeed) : null}
        deltaLabel={deltaSpeed != null ? `${Math.abs(Math.round(deltaSpeed))} km/j` : null}
        history={speedHistory}
        sparkLabel="Riwayat kecepatan rata-rata"
        sparkColor="#7c3aed"
      />
      <KpiCard
        label="Tercepat"
        value={stats.fastestKmh ?? '—'}
        unit="km/j"
        history={[]}
        sparkLabel="Kecepatan tertinggi saat ini"
      />
      <KpiCard
        label="Tertinggi"
        value={stats.highestM != null
          ? Math.round(stats.highestM / 1000 * 10) / 10
          : '—'}
        unit="km"
        history={[]}
        sparkLabel="Ketinggian tertinggi saat ini"
      />
    </div>
  );
}
