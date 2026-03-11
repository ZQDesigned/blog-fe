import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CursorContext, type CursorStyle } from './CursorContext';

const CURSOR_STORAGE_KEY = 'customCursorEnabled';
const CURSOR_STYLE_STORAGE_KEY = 'customCursorStyle';
const CURSOR_USE_CUSTOM_PALETTE_KEY = 'customCursorUseCustomPalette';
const CURSOR_PALETTE_STORAGE_KEY = 'customCursorPalette';
const CUSTOM_CURSOR_DATASET_KEY = 'customCursor';

const CURSOR_PALETTE_BASE_VAR_MAP = {
  dotBackground: '--theme-component-cursor-dot-background',
  dotBorder: '--theme-component-cursor-dot-border',
  ringBorder: '--theme-component-cursor-ring-border',
  ringHoverBorder: '--theme-component-cursor-ring-hover-border',
  ringActiveBorder: '--theme-component-cursor-ring-active-border',
  ringBackground: '--theme-component-cursor-ring-background',
} as const;

const CURSOR_PALETTE_OVERRIDE_VAR_MAP = {
  dotBackground: '--theme-custom-cursor-dot-background',
  dotBorder: '--theme-custom-cursor-dot-border',
  ringBorder: '--theme-custom-cursor-ring-border',
  ringHoverBorder: '--theme-custom-cursor-ring-hover-border',
  ringActiveBorder: '--theme-custom-cursor-ring-active-border',
  ringBackground: '--theme-custom-cursor-ring-background',
} as const;

type CursorPaletteKey = keyof typeof CURSOR_PALETTE_BASE_VAR_MAP;
type CursorPalette = Record<CursorPaletteKey, string>;

const EMPTY_PALETTE: CursorPalette = {
  dotBackground: '',
  dotBorder: '',
  ringBorder: '',
  ringHoverBorder: '',
  ringActiveBorder: '',
  ringBackground: '',
};

const CURSOR_STYLE_SET: ReadonlySet<CursorStyle> = new Set(['orb', 'diamondSword']);

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

const readStoredCursorStyle = (): CursorStyle => {
  if (typeof window === 'undefined') {
    return 'orb';
  }

  const stored = window.localStorage.getItem(CURSOR_STYLE_STORAGE_KEY);
  if (!stored) {
    return 'orb';
  }

  return CURSOR_STYLE_SET.has(stored as CursorStyle)
    ? (stored as CursorStyle)
    : 'orb';
};

const readStoredUseCustomPalette = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const stored = window.localStorage.getItem(CURSOR_USE_CUSTOM_PALETTE_KEY);
  if (stored === null) {
    return false;
  }

  return stored === 'true';
};

const isPaletteObject = (input: unknown): input is CursorPalette => {
  if (!input || typeof input !== 'object') {
    return false;
  }

  return (
    typeof (input as CursorPalette).dotBackground === 'string' &&
    typeof (input as CursorPalette).dotBorder === 'string' &&
    typeof (input as CursorPalette).ringBorder === 'string' &&
    typeof (input as CursorPalette).ringHoverBorder === 'string' &&
    typeof (input as CursorPalette).ringActiveBorder === 'string' &&
    typeof (input as CursorPalette).ringBackground === 'string'
  );
};

const readStoredPalette = (): CursorPalette => {
  if (typeof window === 'undefined') {
    return { ...EMPTY_PALETTE };
  }

  const raw = window.localStorage.getItem(CURSOR_PALETTE_STORAGE_KEY);
  if (!raw) {
    return { ...EMPTY_PALETTE };
  }

  try {
    const parsed = JSON.parse(raw);
    if (isPaletteObject(parsed)) {
      return parsed;
    }
  } catch {
    // ignore invalid JSON and fallback to defaults
  }

  return { ...EMPTY_PALETTE };
};

const getSystemPaletteFromCssVars = (): CursorPalette => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return { ...EMPTY_PALETTE };
  }

  const computed = window.getComputedStyle(document.documentElement);
  return {
    dotBackground: computed
      .getPropertyValue(CURSOR_PALETTE_BASE_VAR_MAP.dotBackground)
      .trim(),
    dotBorder: computed
      .getPropertyValue(CURSOR_PALETTE_BASE_VAR_MAP.dotBorder)
      .trim(),
    ringBorder: computed
      .getPropertyValue(CURSOR_PALETTE_BASE_VAR_MAP.ringBorder)
      .trim(),
    ringHoverBorder: computed
      .getPropertyValue(CURSOR_PALETTE_BASE_VAR_MAP.ringHoverBorder)
      .trim(),
    ringActiveBorder: computed
      .getPropertyValue(CURSOR_PALETTE_BASE_VAR_MAP.ringActiveBorder)
      .trim(),
    ringBackground: computed
      .getPropertyValue(CURSOR_PALETTE_BASE_VAR_MAP.ringBackground)
      .trim(),
  };
};

const canUseColor = (value: string): boolean => {
  if (typeof window === 'undefined' || typeof window.CSS === 'undefined') {
    return false;
  }

  return window.CSS.supports('color', value);
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
  const [style, setStyleState] = useState<CursorStyle>(() => readStoredCursorStyle());
  const [useCustomPalette, setUseCustomPaletteState] = useState<boolean>(() => readStoredUseCustomPalette());
  const [palette, setPalette] = useState<CursorPalette>(() => readStoredPalette());

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
  }, []);

  const setStyle = useCallback((next: CursorStyle) => {
    setStyleState(next);
  }, []);

  const setUseCustomPalette = useCallback((next: boolean) => {
    setUseCustomPaletteState(next);
  }, []);

  const updatePalette = useCallback((key: CursorPaletteKey, value: string) => {
    setPalette((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const resetPaletteToSystem = useCallback(() => {
    setUseCustomPaletteState(false);
    setPalette(getSystemPaletteFromCssVars());
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
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CURSOR_STYLE_STORAGE_KEY, style);
  }, [style]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      CURSOR_USE_CUSTOM_PALETTE_KEY,
      String(useCustomPalette),
    );
  }, [useCustomPalette]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      CURSOR_PALETTE_STORAGE_KEY,
      JSON.stringify(palette),
    );
  }, [palette]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const hasUninitializedValue = (
      Object.keys(CURSOR_PALETTE_BASE_VAR_MAP) as CursorPaletteKey[]
    ).some((key) => !palette[key]);

    if (!hasUninitializedValue) {
      return;
    }

    const systemPalette = getSystemPaletteFromCssVars();
    setPalette((current) => {
      const next = { ...current };
      let changed = false;

      (Object.keys(CURSOR_PALETTE_BASE_VAR_MAP) as CursorPaletteKey[]).forEach((key) => {
        if (!next[key] && systemPalette[key]) {
          next[key] = systemPalette[key];
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [palette]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const rootElement = document.documentElement;
    const paletteEntries = Object.entries(CURSOR_PALETTE_OVERRIDE_VAR_MAP) as Array<
      [CursorPaletteKey, string]
    >;

    if (!useCustomPalette) {
      paletteEntries.forEach(([, cssVarName]) => {
        rootElement.style.removeProperty(cssVarName);
      });
      return;
    }

    paletteEntries.forEach(([paletteKey, cssVarName]) => {
      const nextValue = palette[paletteKey].trim();

      if (nextValue && canUseColor(nextValue)) {
        rootElement.style.setProperty(cssVarName, nextValue);
      } else {
        rootElement.style.removeProperty(cssVarName);
      }
    });

    return () => {
      if (!useCustomPalette) {
        return;
      }

      paletteEntries.forEach(([, cssVarName]) => {
        rootElement.style.removeProperty(cssVarName);
      });
    };
  }, [palette, useCustomPalette]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const rootElement = document.documentElement;
    const applyCursorLock = () => {
      const bodyElement = document.body;
      rootElement.dataset[CUSTOM_CURSOR_DATASET_KEY] = 'on';
      rootElement.style.setProperty('cursor', 'none', 'important');
      if (bodyElement) {
        bodyElement.style.setProperty('cursor', 'none', 'important');
      }
    };

    const clearCursorLock = () => {
      const bodyElement = document.body;
      delete rootElement.dataset[CUSTOM_CURSOR_DATASET_KEY];
      rootElement.style.removeProperty('cursor');
      if (bodyElement) {
        bodyElement.style.removeProperty('cursor');
      }
    };

    if (!cursorEnabled) {
      clearCursorLock();
      return clearCursorLock;
    }

    const ensureCursorLock = () => {
      const bodyElement = document.body;
      const rootLocked =
        rootElement.dataset[CUSTOM_CURSOR_DATASET_KEY] === 'on' &&
        rootElement.style.getPropertyValue('cursor') === 'none' &&
        rootElement.style.getPropertyPriority('cursor') === 'important';
      const bodyLocked = !bodyElement
        || (
          bodyElement.style.getPropertyValue('cursor') === 'none'
          && bodyElement.style.getPropertyPriority('cursor') === 'important'
        );

      if (!rootLocked || !bodyLocked) {
        applyCursorLock();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        ensureCursorLock();
      }
    };

    applyCursorLock();
    window.addEventListener('pointermove', ensureCursorLock, { passive: true });
    window.addEventListener('focus', ensureCursorLock);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointermove', ensureCursorLock);
      window.removeEventListener('focus', ensureCursorLock);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearCursorLock();
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
      style,
      useCustomPalette,
      palette,
      setEnabled,
      setStyle,
      setUseCustomPalette,
      updatePalette,
      resetPaletteToSystem,
    }),
    [
      enabled,
      active,
      isSupported,
      style,
      useCustomPalette,
      palette,
      setEnabled,
      setStyle,
      setUseCustomPalette,
      updatePalette,
      resetPaletteToSystem,
    ],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};
