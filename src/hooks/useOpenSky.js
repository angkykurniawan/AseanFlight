// ============================================================
// useOpenSky.js – Hook utama polling data OpenSky Network
//
// CATATAN BATAS KREDIT OPENSKY (pengguna anonim):
//   - Maksimal 400 permintaan per hari (~16/jam atau ~1 per 4 menit).
//   - Interval polling di sini diset 60 detik; bila mendapat HTTP 429
//     (Too Many Requests) maka polling dijeda dengan backoff
//     60 → 120 → 300 detik sebelum mencoba lagi.
//   - Dokumen resmi: https://openskynetwork.github.io/opensky-api/rest.html
// ============================================================
import { useEffect, useRef, useCallback } from 'react';
import {
  OPENSKY_API_URL,
  ASEAN_BBOX,
  POLL_INTERVAL_MS,
  BACKOFF_DURATIONS_MS,
  COUNTDOWN_TICK_MS,
} from '../config.js';
import { parseOpenSkyResponse, parseStateVector } from '../utils/parse.js';
import { useFlightContext } from '../context/FlightContext.jsx';
import sampleFlights from '../data/sampleFlights.js';

/** Mem-build URL API OpenSky dengan bounding box ASEAN. */
function buildApiUrl() {
  const { lamin, lomin, lamax, lomax } = ASEAN_BBOX;
  return `${OPENSKY_API_URL}?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
}

/** Mengambil dan mengembalikan dataset sampel sebagai fallback. */
function getSampleData() {
  const parsed = [];
  for (const sv of sampleFlights) {
    const f = parseStateVector(sv);
    if (f && f.airspaceCountry) parsed.push(f);
  }
  return parsed;
}

/**
 * useOpenSky – mengelola polling, countdown, backoff, dan fallback data sampel.
 *
 * Desain untuk StrictMode:
 *   - mountedRef di-set di dalam useEffect (bukan saat inisialisasi useRef),
 *     sehingga siklus mount→unmount→remount StrictMode dev tidak menyisakan
 *     mountedRef=false pada render final.
 *   - Semua fungsi yang dipanggil dari dalam timer (scheduleNext, fetchFlights,
 *     startCountdown) disimpan di ref agar selalu memakai versi terkini tanpa
 *     menyebabkan useEffect berjalan ulang.
 *
 * @param {React.MutableRefObject<function>} onRefreshRef – ref ke callback history
 */
export function useOpenSky(onRefreshRef) {
  const {
    setFlights,
    setDataStatus,
    setLastUpdated,
    setCountdown,
    setRateLimitBanner,
    addLog,
  } = useFlightContext();

  // --- State refs (tidak menyebabkan re-render) ---
  const backoffIndexRef   = useRef(0);
  const isFetchingRef     = useRef(false);
  const abortCtrlRef      = useRef(null);
  const pollTimerRef      = useRef(null);
  const countdownTimerRef = useRef(null);
  const nextIntervalRef   = useRef(POLL_INTERVAL_MS);
  // false di sini; akan di-set true di dalam useEffect agar StrictMode aman
  const mountedRef        = useRef(false);

  // Refs untuk fungsi agar tidak masuk dependency array useEffect
  const setCountdownRef      = useRef(setCountdown);
  const setFlightsRef        = useRef(setFlights);
  const setDataStatusRef     = useRef(setDataStatus);
  const setLastUpdatedRef    = useRef(setLastUpdated);
  const setRateLimitBannerRef = useRef(setRateLimitBanner);
  const onRefreshRefLocal    = useRef(onRefreshRef);
  const addLogRef            = useRef(addLog);

  // Sinkronkan ref setiap render (setter dari useState stabil, tapi tetap aman)
  setCountdownRef.current      = setCountdown;
  setFlightsRef.current        = setFlights;
  setDataStatusRef.current     = setDataStatus;
  setLastUpdatedRef.current    = setLastUpdated;
  setRateLimitBannerRef.current = setRateLimitBanner;
  onRefreshRefLocal.current    = onRefreshRef;
  addLogRef.current            = addLog;

  /** Ref ke manualRefresh agar komponen luar bisa memanggilnya */
  const manualRefreshRef = useRef(null);

  useEffect(() => {
    // Set true di sini — setelah StrictMode unmount pertama, nilai ini
    // akan di-reset true lagi pada mount kedua (mount final yang nyata).
    mountedRef.current = true;

    // --- startCountdown ---
    function startCountdown(durationMs) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      let remaining = Math.ceil(durationMs / 1000);
      setCountdownRef.current(remaining);
      countdownTimerRef.current = setInterval(() => {
        if (!mountedRef.current) {
          clearInterval(countdownTimerRef.current);
          return;
        }
        remaining -= 1;
        setCountdownRef.current(remaining);
        if (remaining <= 0) clearInterval(countdownTimerRef.current);
      }, COUNTDOWN_TICK_MS);
    }

    // --- fetchFlights ---
    async function fetchFlights() {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      // Batalkan request sebelumnya bila masih berjalan
      if (abortCtrlRef.current) abortCtrlRef.current.abort();
      abortCtrlRef.current = new AbortController();

      const startTime = performance.now();

      try {
        const res = await fetch(buildApiUrl(), {
          signal: abortCtrlRef.current.signal,
        });

        const latency = Math.round(performance.now() - startTime);

        if (!mountedRef.current) return;

        // --- HTTP 429: Rate Limited ---
        if (res.status === 429) {
          const backoffMs =
            BACKOFF_DURATIONS_MS[
              Math.min(backoffIndexRef.current, BACKOFF_DURATIONS_MS.length - 1)
            ];
          backoffIndexRef.current = Math.min(
            backoffIndexRef.current + 1,
            BACKOFF_DURATIONS_MS.length - 1
          );
          nextIntervalRef.current = backoffMs;
          setDataStatusRef.current('rate-limited');
          setRateLimitBannerRef.current(true);
          onRefreshRefLocal.current?.current?.(null);
          addLogRef.current?.({
            level: 'warn',
            category: 'api',
            message: `Batas kuota OpenSky tercapai (HTTP 429). Mengaktifkan backoff jeda ${backoffMs / 1000} detik`,
            details: `Latency: ${latency}ms · Status: rate-limited · Kuota harian habis`,
          });
          startCountdown(backoffMs);
          isFetchingRef.current = false;
          return;
        }

        // --- Respons non-OK lainnya ---
        if (!res.ok) {
          setDataStatusRef.current('offline');
          setRateLimitBannerRef.current(false);
          addLogRef.current?.({
            level: 'error',
            category: 'api',
            message: `Gagal memuat OpenSky API (HTTP ${res.status}: ${res.statusText || 'Error'})`,
            details: `Latency: ${latency}ms · Status: offline`,
          });
          startCountdown(nextIntervalRef.current);
          isFetchingRef.current = false;
          return;
        }

        const json = await res.json();
        if (!mountedRef.current) return;

        const flights = parseOpenSkyResponse(json);
        backoffIndexRef.current = 0;
        nextIntervalRef.current = POLL_INTERVAL_MS;
        setFlightsRef.current(flights);
        setDataStatusRef.current('live');
        setRateLimitBannerRef.current(false);
        setLastUpdatedRef.current(new Date());
        onRefreshRefLocal.current?.current?.(flights);
        addLogRef.current?.({
          level: 'success',
          category: 'api',
          message: `Data radar berhasil diperbarui: ${flights.length} pesawat terdeteksi di ruang udara ASEAN`,
          details: `Latency: ${latency}ms · Mode: LIVE · Interval berikutnya: ${POLL_INTERVAL_MS / 1000}s`,
        });
        startCountdown(POLL_INTERVAL_MS);
      } catch (err) {
        if (!mountedRef.current) return;
        if (err.name === 'AbortError') {
          isFetchingRef.current = false;
          return;
        }
        // Network error → fallback ke data sampel
        const sampleData = getSampleData();
        setFlightsRef.current(sampleData);
        setDataStatusRef.current('demo');
        setRateLimitBannerRef.current(false);
        setLastUpdatedRef.current(new Date());
        onRefreshRefLocal.current?.current?.(sampleData);
        addLogRef.current?.({
          level: 'warn',
          category: 'api',
          message: `Koneksi ke API OpenSky bermasalah (${err.message}). Menggunakan dataset demo lokal`,
          details: `Fallback: ${sampleData.length} pesawat sampel · Mode: DEMO`,
        });
        startCountdown(nextIntervalRef.current);
      } finally {
        isFetchingRef.current = false;
      }
    }

    // --- scheduleNext ---
    function scheduleNext() {
      if (!mountedRef.current) return;
      fetchFlights().then(() => {
        if (!mountedRef.current) return;
        pollTimerRef.current = setTimeout(scheduleNext, nextIntervalRef.current);
      });
    }

    // Simpan ke ref agar manualRefresh bisa memakai versi terkini
    manualRefreshRef.current = () => {
      addLogRef.current?.({
        level: 'info',
        category: 'user',
        message: 'Pengguna melakukan refresh manual data radar',
      });
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      fetchFlights().then(() => {
        if (!mountedRef.current) return;
        pollTimerRef.current = setTimeout(scheduleNext, nextIntervalRef.current);
      });
    };

    // Fetch pertama segera saat mount
    fetchFlights().then(() => {
      if (!mountedRef.current) return;
      pollTimerRef.current = setTimeout(scheduleNext, nextIntervalRef.current);
    });

    return () => {
      // Cleanup lengkap – aman terhadap StrictMode
      mountedRef.current = false;
      isFetchingRef.current = false;
      if (pollTimerRef.current)      clearTimeout(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (abortCtrlRef.current)      abortCtrlRef.current.abort();
    };
  }, []); // sengaja kosong: semua state diakses via ref, bukan closure

  /** Callback stabil untuk tombol Refresh di UI */
  const manualRefresh = useCallback(() => {
    manualRefreshRef.current?.();
  }, []);

  return { manualRefresh };
}
