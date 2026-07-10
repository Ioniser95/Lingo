import { useEffect, useState } from "react";

/** True after the first client render — use to gate persisted state to avoid SSR hydration mismatch. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
