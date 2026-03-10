import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CursorContext } from './CursorContext';

const CURSOR_STORAGE_KEY = 'customCursorEnabled';
const CUSTOM_CURSOR_DATASET_KEY = 'customCursor';

const readStoredCursorEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  const stored = window.localStorage.getItem(CURSOR_STORAGE_KEY);
  if (stored === null) {
    return true;
  }

  return stored === 'true';
};

const getCursorSupport = (): boolean => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    typeof window.PointerEvent === 'undefined'
  ) {
    return false;
  }

  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const hasHoverCapability = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const forcedColorsActive = window.matchMedia('(forced-colors: active)').matches;

  return hasFinePointer && hasHoverCapability && !prefersReducedMotion && !forcedColorsActive;
};

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabledState] = useState<boolean>(() => readStoredCursorEnabled());
  const [isSupported, setIsSupported] = useState<boolean>(() => getCursorSupport());
  const [active, setActive] = useState<boolean>(false);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
  }, []);

  const cursorEnabled = enabled && isSupported;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueries = [
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(forced-colors: active)'),
    ];

    const handleChange = () => {
      setIsSupported(getCursorSupport());
    };

    mediaQueries.forEach((mediaQuery) => {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }
    });

    return () => {
      mediaQueries.forEach((mediaQuery) => {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CURSOR_STORAGE_KEY, String(enabled));
  }, [enabled]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const rootElement = document.documentElement;
    if (cursorEnabled) {
      rootElement.dataset[CUSTOM_CURSOR_DATASET_KEY] = 'on';
    } else {
      delete rootElement.dataset[CUSTOM_CURSOR_DATASET_KEY];
    }

    return () => {
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset[CUSTOM_CURSOR_DATASET_KEY];
      }
    };
  }, [cursorEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || !cursorEnabled) {
      setActive(false);
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        setActive(true);
      }
    };

    const handlePointerUp = () => {
      setActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActive(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('blur', handlePointerUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', handlePointerUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cursorEnabled]);

  const value = useMemo(
    () => ({
      enabled,
      active,
      isSupported,
      setEnabled,
    }),
    [enabled, active, isSupported, setEnabled],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};
