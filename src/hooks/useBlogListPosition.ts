import { useEffect, useRef } from 'react';
import { getListPosition, saveListPosition } from '../utils/readingState';

export function useBlogListPosition(url: string, ready: boolean) {
  const position = useRef(0);
  useEffect(() => {
    if (!ready) return;
    const target = getListPosition(url);
    position.current = target;
    let active = true;
    let restoring = target > 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    const started = performance.now();
    const persist = () => saveListPosition(url, position.current);
    const restore = () => {
      if (!active || !restoring) return;
      window.scrollTo({ top: target, behavior: 'instant' });
      if (document.documentElement.scrollHeight - window.innerHeight >= target || performance.now() - started > 2000) restoring = false;
      else frame = requestAnimationFrame(restore);
    };
    const interrupt = () => { restoring = false; cancelAnimationFrame(frame); };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) interrupt();
    };
    const record = () => {
      if (restoring) return;
      position.current = window.scrollY;
      clearTimeout(timer); timer = setTimeout(persist, 150);
    };
    if (restoring) void document.fonts.ready.then(() => { if (active) frame = requestAnimationFrame(restore); });
    window.addEventListener('scroll', record, { passive: true });
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchmove', interrupt, { passive: true });
    window.addEventListener('pagehide', persist);
    window.addEventListener('keydown', onKey);
    return () => {
      active = false; clearTimeout(timer); cancelAnimationFrame(frame); persist();
      window.removeEventListener('scroll', record); window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchmove', interrupt); window.removeEventListener('pagehide', persist);
      window.removeEventListener('keydown', onKey);
    };
  }, [url, ready]);
  return () => saveListPosition(url, window.scrollY);
}
