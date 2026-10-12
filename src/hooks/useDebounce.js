// ============================================================
// useDebounce.js – Debounce nilai dengan delay tertentu
// ============================================================
import { useState, useEffect } from 'react';

/**
 * Mengembalikan nilai yang di-debounce setelah `delay` ms.
 * @param {any} value
 * @param {number} delay  – milidetik (default 400)
 * @returns {any}
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
