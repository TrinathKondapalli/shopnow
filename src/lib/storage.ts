import { useEffect, useState } from 'react';

const PREFIX = 'shopnow:v1:';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage can be full or blocked (private mode); the store keeps working in memory */
  }
}

/**
 * useState that is saved to localStorage and restored after refresh.
 * `sanitize` drops anything stale, such as products that no longer exist.
 */
export function usePersistentState<T>(key: string, initial: T, sanitize: (v: T) => T = (v) => v) {
  const [value, setValue] = useState<T>(() => sanitize(readJSON(key, initial)));
  useEffect(() => { writeJSON(key, value); }, [key, value]);
  return [value, setValue] as const;
}
