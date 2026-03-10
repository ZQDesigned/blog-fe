import { useContext } from 'react';
import { CursorContext } from '../provider/CursorContext';

export const useCursor = () => {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error('useCursor must be used within CursorProvider');
  }

  return context;
};
