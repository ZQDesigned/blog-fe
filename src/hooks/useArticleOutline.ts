import { useEffect, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { readingOffset } from '../utils/readingState';

export interface ArticleHeading { id: string; text: string; level: number }

export function useArticleOutline(root: RefObject<HTMLDivElement | null>, content?: string, hash = '') {
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);
  const [activeId, setActiveId] = useState('');
  useLayoutEffect(() => {
    if (!root.current || content === undefined) {
      setHeadings([]);
      return;
    }
    const used = new Set<string>();
    const elements = [...root.current.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6')];
    const outline = elements.map((element, index) => {
      const text = (element.querySelector('[data-heading-text]')?.textContent || element.textContent || '').trim();
      const slug = text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/[\s-]+/g, '-');
      const base = element.getAttribute('data-reading-original-id') ?? element.id;
      element.setAttribute('data-reading-original-id', base);
      const preferred = base || `section-${slug || index + 1}`;
      let id = preferred;
      let suffix = 1;
      while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== element)) id = `${preferred}-${++suffix}`;
      used.add(id);
      element.id = id;
      return { id, text: text || `章节 ${index + 1}`, level: Number(element.tagName[1]) };
    });
    setHeadings(outline);
    let positions: { id: string; top: number }[] = [];
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY + readingOffset() + 16;
      let low = 0;
      let high = positions.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (positions[mid].top <= y) low = mid + 1;
        else high = mid - 1;
      }
      setActiveId(positions[Math.max(0, high)]?.id || '');
    };
    const measure = () => {
      positions = elements.map(element => ({ id: element.id, top: element.getBoundingClientRect().top + window.scrollY }));
      update();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure);
    };
  }, [root, content]);

  useEffect(() => {
    if (!hash || !root.current) return;
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const element = document.getElementById(id);
    if (!element || !root.current.contains(element)) return;
    let cancelled = false;
    let interacted = false;
    const markInteraction = () => { interacted = true; };
    const scroll = () => { if (!cancelled && !interacted) element.scrollIntoView({ block: 'start', behavior: 'instant' }); };
    const frame = requestAnimationFrame(scroll);
    void document.fonts.ready.then(scroll);
    window.addEventListener('wheel', markInteraction, { passive: true });
    window.addEventListener('touchmove', markInteraction, { passive: true });
    return () => {
      cancelled = true; cancelAnimationFrame(frame);
      window.removeEventListener('wheel', markInteraction); window.removeEventListener('touchmove', markInteraction);
    };
  }, [hash, content, root]);
  return { headings, activeId };
}
