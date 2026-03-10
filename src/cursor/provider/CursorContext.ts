import React from 'react';

export interface CursorContextValue {
  enabled: boolean;
  active: boolean;
  isSupported: boolean;
  setEnabled: (next: boolean) => void;
}

export const CursorContext = React.createContext<CursorContextValue | undefined>(undefined);
