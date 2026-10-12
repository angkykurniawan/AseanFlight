// ============================================================
// FlightMap.jsx – Peta react-leaflet dengan marker pesawat
// ============================================================
import { useState, useEffect, Component } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AircraftMarker from './AircraftMarker.jsx';
import AircraftSearch from './AircraftSearch.jsx';
import { ASEAN_MAP_BOUNDS } from '../../config.js';
import { getCountryBounds } from '../../utils/geo.js';

// Fix Leaflet default icon paths yang rusak di Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
});

/* ---- Komponen internal: bereaksi pada perubahan bounds / flyTo / status kunci ---- */
function MapController({ filterCountry, selectedFlight, isLocked }) {
  const map = useMap();

  // Kunci atau buka interaksi gestur peta (dragging, touch, scroll)
  useEffect(() => {
    if (isLocked) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (filterCountry && filterCountry !== 'all') {
        const bounds = getCountryBounds(filterCountry);
        if (bounds) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 });
      } else {
        map.fitBounds(ASEAN_MAP_BOUNDS, { padding: [20, 20] });
      }
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }, [isLocked, map, filterCountry]);

  // Zoom ke negara terpilih saat filter berganti
  useEffect(() => {
    if (filterCountry && filterCountry !== 'all') {
      const bounds = getCountryBounds(filterCountry);
      if (bounds) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 });
    } else {
      map.fitBounds(ASEAN_MAP_BOUNDS, { padding: [20, 20] });
    }
  }, [filterCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  // FlyTo pesawat yang dicari
  useEffect(() => {
    if (selectedFlight) {
      map.flyTo([selectedFlight.latitude, selectedFlight.longitude], 9, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedFlight]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

/* ---- Error Boundary untuk peta ---- */
class MapErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{ minHeight: 300 }}>
          <div className="error-boundary__title">⚠ Peta Tidak Tersedia</div>
          <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 8 }}>
            {this.state.error?.message ?? 'Terjadi kesalahan pada komponen peta.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * @param {object[]} flights        – pesawat yang sudah difilter
 * @param {string}   filterCountry
 * @param {object|null} selectedFlight – dari AircraftSearch
 * @param {function} onSelectFlight
 */
export default function FlightMap({ flights, filterCountry, selectedFlight, onSelectFlight }) {
  const [isLocked, setIsLocked] = useState(true);

  // Ambil Carto Basemap API Key untuk menghilangkan watermark 'API KEY REQUIRED'
  const cartoKey = (
    import.meta.env.VITE_CARTO_API_KEY ||
    (import.meta.env.VITE_OPENSKY_API_KEY?.startsWith('cb1_') ? import.meta.env.VITE_OPENSKY_API_KEY : '') ||
    'cb1_4hle_1_97c69280b10b32db4f60879e'
  ).trim();

  const tileUrl = cartoKey
    ? `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
    : `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`;

  return (
    <div className="map-card">
      <div className="map-card__header">
        <h2 className="map-card__title">
          ✈ Posisi Pesawat Real-time
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginLeft: 8 }}>
            ({flights.length} pesawat)
          </span>
        </h2>
        <div className="map-card__actions">
          <button
            type="button"
            className={`map-lock-btn ${isLocked ? 'map-lock-btn--locked' : ''}`}
            onClick={() => setIsLocked((prev) => !prev)}
            title={isLocked ? 'Peta terkunci (klik untuk mengizinkan geser/zoom peta)' : 'Peta bebas geser (klik untuk mengunci posisi peta)'}
            aria-label={isLocked ? 'Buka kunci interaksi peta' : 'Kunci posisi peta'}
          >
            {isLocked ? '🔒 Posisi Tetap' : '🔓 Mode Geser'}
          </button>
          <AircraftSearch
            flights={flights}
            onSelectFlight={onSelectFlight}
          />
        </div>
      </div>

      <div className="map-container">
        <MapErrorBoundary>
          <MapContainer
            bounds={ASEAN_MAP_BOUNDS}
            boundsOptions={{ padding: [20, 20] }}
            maxBounds={ASEAN_MAP_BOUNDS}
            maxBoundsViscosity={1.0}
            dragging={false}
            touchZoom={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
            style={{ height: '100%', width: '100%' }}
            aria-label="Peta wilayah udara ASEAN"
          >
            <TileLayer
              url={tileUrl}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={19}
            />
            <MapController
              filterCountry={filterCountry}
              selectedFlight={selectedFlight}
              isLocked={isLocked}
            />
            {flights.map((flight) => (
              <AircraftMarker key={flight.icao24} flight={flight} />
            ))}
          </MapContainer>
        </MapErrorBoundary>
      </div>
    </div>
  );
}
