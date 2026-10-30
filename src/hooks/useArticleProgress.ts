import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { clearReadingProgress, getReadingProgress, readingOffset, saveReadingProgress } from '../utils/readingState';
import type { ReadingProgress } from '../utils/readingState';

export function useArticleProgress(root: RefObject<HTMLDivElement | null>, id?: number, revision?: string) {
  const [saved, setSaved] = useState<ReadingProgress | null>(null);
  const interacted = useRef(false);
  const generation = useRef(0);
  const resumeFrame = useRef(0);
  useEffect(() => {
    if (id === undefined || revision === undefined || !root.current) return;
    generation.current += 1;
    const articleId = String(id);
    setSaved(window.location.hash ? null : getReadingProgress(articleId, revision));
    interacted.current = false;
    let latest: ReadingProgress | 'complete' | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const flush = () => {
      const pending = latest;
      latest = null;
      if (pending === 'complete') clearReadingProgress(articleId);
      else if (pending) saveReadingProgress(pending);
    };
    const mark = () => { interacted.current = true; };
    const key = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) mark();
    };
    const record = () => {
      const body = root.current;
      if (!interacted.current || !body || body.offsetHeight < 600) return;
      const top = body.getBoundingClientRect().top + window.scrollY;
      const offset = readingOffset();
      const ratio = Math.max(0, Math.min(1, (window.scrollY + offset - top) / body.offsetHeight));
      if (window.scrollY + window.innerHeight >= top + body.offsetHeight - 40) latest = 'complete';
      else if (ratio >= 0.05 && ratio < 0.95) {
        const headings = [...body.querySelectorAll<HTMLHeadingElement>('.reading-heading[id]')];
        let anchor = headings[0];
        for (const heading of headings) { if (heading.getBoundingClientRect().top <= offset + 16) anchor = heading; else break; }
        const anchorTop = anchor ? anchor.getBoundingClientRect().top + window.scrollY - offset : top;
        latest = { id: articleId, revision, heading: anchor?.id || '', offset: window.scrollY - anchorTop, ratio, at: Date.now() };
      } else return;
      setSaved(null);
      clearTimeout(timer);
      timer = setTimeout(flush, 250);
    };
    window.addEventListener('wheel', mark, { passive: true });
    window.addEventListener('touchmove', mark, { passive: true });
    window.addEventListener('pointerdown', mark, { passive: true });
    window.addEventListener('keydown', key);
    window.addEventListener('scroll', record, { passive: true });
    window.addEventListener('pagehide', flush);
    return () => {
      generation.current += 1; cancelAnimationFrame(resumeFrame.current);
      clearTimeout(timer); flush();
      window.removeEventListener('wheel', mark); window.removeEventListener('touchmove', mark);
      window.removeEventListener('pointerdown', mark); window.removeEventListener('keydown', key);
      window.removeEventListener('scroll', record); window.removeEventListener('pagehide', flush);
    };
  }, [root, id, revision]);

  const resume = () => {
    if (!saved || !root.current) return;
    const version = generation.current;
    setSaved(null);
    // Measure after removing the prompt; otherwise its height shifts the target.
    void document.fonts.ready.then(() => {
      if (version !== generation.current) return;
      resumeFrame.current = requestAnimationFrame(() => {
        if (!root.current || version !== generation.current) return;
        const element = document.getElementById(saved.heading);
        const top = root.current.getBoundingClientRect().top + window.scrollY;
        const offset = readingOffset();
        const y = element && root.current.contains(element)
          ? element.getBoundingClientRect().top + window.scrollY - offset + saved.offset
          : top + saved.ratio * root.current.offsetHeight - offset;
        interacted.current = true;
        window.scrollTo({ top: Math.max(0, y), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      });
    });
  };
  return { saved, resume };
}
