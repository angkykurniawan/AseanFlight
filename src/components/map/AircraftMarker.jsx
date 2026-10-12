// ============================================================
// AircraftMarker.jsx – Marker pesawat di peta (React.memo)
// ============================================================
import { memo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { COUNTRY_NAME_BY_CODE } from '../../config.js';
import { formatAltitude, formatSpeed } from '../../utils/convert.js';

/**
 * Membuat L.divIcon dengan SVG pesawat yang dirotasi sesuai true_track.
 */
function createPlaneIcon(trueTrack, onGround) {
  const color = onGround ? '#6b7280' : '#1a2b4a';
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g transform="rotate(${trueTrack}, 12, 12)">
    <path fill="${color}" d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 19 L6 22 L7 15 L2 10 L9 9 Z" opacity="0.15"/>
    <path fill="${color}" stroke="white" stroke-width="0.5"
      d="M12 3 C12 3 14 7 14 10 L21 13 L14 14 L13 21 L12 20 L11 21 L10 14 L3 13 L10 10 C10 7 12 3 12 3 Z"/>
  </g>
</svg>`.trim();

  return L.divIcon({
    className: 'flight-marker',
    html: svg,
    iconSize:   [24, 24],
    iconAnchor: [12, 12],
    popupAnchor:[0, -14],
  });
}

const AircraftMarker = memo(function AircraftMarker({ flight }) {
  const icon = createPlaneIcon(flight.trueTrack ?? 0, flight.onGround);

  const airspaceName = flight.airspaceCountry
    ? (COUNTRY_NAME_BY_CODE[flight.airspaceCountry] ?? flight.airspaceCountry)
    : '—';

  return (
    <Marker
      key={flight.icao24}
      position={[flight.latitude, flight.longitude]}
      icon={icon}
      aria-label={`Pesawat ${flight.callsign}`}
    >
      <Popup>
        <div className="flight-popup">
          <div className="flight-popup__header">
            <div className="flight-popup__callsign">{flight.callsign}</div>
            <div className="flight-popup__icao">ICAO24: {flight.icao24.toUpperCase()}</div>
          </div>
          <div className="flight-popup__body">
            <div className="flight-popup__row">
              <span className="flight-popup__key">Asal</span>
              <span className="flight-popup__val">{flight.originCountry}</span>
            </div>
            <div className="flight-popup__row">
              <span className="flight-popup__key">Wilayah Udara</span>
              <span className="flight-popup__val">{airspaceName}</span>
            </div>
            <div className="flight-popup__row">
              <span className="flight-popup__key">Status</span>
              <span className="flight-popup__val">
                {flight.onGround ? '🛬 Di Darat' : '✈ Di Udara'}
              </span>
            </div>
            <div className="flight-popup__row">
              <span className="flight-popup__key">Ketinggian</span>
              <span className="flight-popup__val">
                {formatAltitude(flight.altitudeM)}
              </span>
            </div>
            <div className="flight-popup__row">
              <span className="flight-popup__key">Kecepatan</span>
              <span className="flight-popup__val">
                {formatSpeed(flight.velocityKmh)}{' '}
                {flight.velocityKnot != null ? `(${flight.velocityKnot} kts)` : ''}
              </span>
            </div>
            <div className="flight-popup__row">
              <span className="flight-popup__key">Arah</span>
              <span className="flight-popup__val">{flight.trueTrack ?? 'N/A'}°</span>
            </div>
            <div className="flight-popup__row">
              <span className="flight-popup__key">Kategori</span>
              <span className="flight-popup__val">{flight.altCategory}</span>
            </div>
          </div>
          <div className="flight-popup__note">
            * Wilayah udara ditentukan berdasarkan perkiraan posisi bounding box, bukan batas resmi.
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

export default AircraftMarker;
