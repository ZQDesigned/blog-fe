import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useStandaloneMode = () => {
  const location = useLocation();
  
  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('mode') === 'standalone';
  }, [location.search]);
}; 