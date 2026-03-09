import React from 'react';
import type { ThemeContextValue } from '../types';

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);
