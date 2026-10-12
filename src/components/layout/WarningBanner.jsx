// ============================================================
// WarningBanner.jsx – Banner peringatan rate-limit
// ============================================================

export default function WarningBanner({ visible, countdown }) {
  if (!visible) return null;
  return (
    <div
      className="warning-banner"
      role="alert"
      aria-live="assertive"
    >
      <span className="warning-banner__icon" aria-hidden="true">⚠️</span>
      <span>
        <strong>Batas permintaan API tercapai (HTTP 429).</strong>{' '}
        Polling dijeda untuk menghindari pemblokiran.
        {countdown > 0 && (
          <> Mencoba lagi dalam <strong>{countdown} detik</strong>.</>
        )}
        {' '}Data yang ditampilkan adalah data terakhir yang berhasil diambil.
      </span>
    </div>
  );
}
