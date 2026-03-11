import React from 'react';

export type CursorStyle = 'orb' | 'diamondSword';

export interface CursorContextValue {
  enabled: boolean;
  active: boolean;
  isSupported: boolean;
  style: CursorStyle;
  useCustomPalette: boolean;
  palette: {
    dotBackground: string;
    dotBorder: string;
    ringBorder: string;
    ringHoverBorder: string;
    ringActiveBorder: string;
    ringBackground: string;
  };
  setEnabled: (next: boolean) => void;
  setStyle: (next: CursorStyle) => void;
  setUseCustomPalette: (next: boolean) => void;
  updatePalette: (
    key: 'dotBackground' | 'dotBorder' | 'ringBorder' | 'ringHoverBorder' | 'ringActiveBorder' | 'ringBackground',
    value: string,
  ) => void;
  resetPaletteToSystem: () => void;
}

export const CursorContext = React.createContext<CursorContextValue | undefined>(undefined);
