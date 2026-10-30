const createSafeStorage = (kind: 'localStorage' | 'sessionStorage') => {
  const fallback = new Map<string, string | null>();

  return {
    getItem(key: string): string | null {
      if (typeof window === 'undefined') return null;
      if (fallback.has(key)) return fallback.get(key) ?? null;
      try {
        return window[kind].getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string): void {
      if (typeof window === 'undefined') return;
      try {
        window[kind].setItem(key, value);
        fallback.delete(key);
      } catch {
        // Preferences must remain usable when persistence is blocked or full.
        fallback.set(key, value);
      }
    },
    removeItem(key: string): void {
      if (typeof window === 'undefined') return;
      try {
        window[kind].removeItem(key);
        fallback.delete(key);
      } catch {
        fallback.set(key, null);
      }
    },
  };
};

export const safeLocalStorage = createSafeStorage('localStorage');
export const safeSessionStorage = createSafeStorage('sessionStorage');
