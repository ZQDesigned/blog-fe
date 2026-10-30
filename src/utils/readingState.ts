import { safeLocalStorage, safeSessionStorage } from './storage';

export interface ReadingProgress {
  id: string; revision: string; heading: string; offset: number; ratio: number; at: number;
}
interface ListPosition { url: string; y: number; at: number }
const PROGRESS_KEY = 'blog-reading-progress:v1';
const LIST_KEY = 'blog-list-positions:v1';
const DAY = 86400000;
export const readingOffset = () => document.documentElement.dataset.standalone === 'true' ? 24 : 112;
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const recent = (at: unknown, days: number): at is number => typeof at === 'number' && Number.isFinite(at)
  && Date.now() >= at && Date.now() - at < days * DAY;

const readProgressRecords = (): ReadingProgress[] => {
  try {
    const data: unknown = JSON.parse(safeLocalStorage.getItem(PROGRESS_KEY) || '[]');
    return Array.isArray(data) ? data.filter((item): item is ReadingProgress => object(item)
      && typeof item.id === 'string' && typeof item.revision === 'string' && typeof item.heading === 'string'
      && typeof item.offset === 'number' && Number.isFinite(item.offset) && Math.abs(item.offset) < 1000000
      && typeof item.ratio === 'number' && item.ratio > 0 && item.ratio < 1 && recent(item.at, 30)) : [];
  } catch { return []; }
};
export const getReadingProgress = (id: string, revision: string) =>
  readProgressRecords().find(item => item.id === id && item.revision === revision) || null;
export const saveReadingProgress = (progress: ReadingProgress) => {
  const entries = readProgressRecords().filter(item => item.id !== progress.id);
  safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify([...entries, progress].slice(-30)));
};
export const clearReadingProgress = (id: string) => {
  safeLocalStorage.setItem(PROGRESS_KEY, JSON.stringify(readProgressRecords().filter(item => item.id !== id)));
};

export const blogListKey = (search: string) => {
  const params = new URLSearchParams(search);
  params.sort();
  return `/blog${params.size ? `?${params}` : ''}`;
};
const readListPositions = (): ListPosition[] => {
  try {
    const data: unknown = JSON.parse(safeSessionStorage.getItem(LIST_KEY) || '[]');
    return Array.isArray(data) ? data.filter((item): item is ListPosition => object(item)
      && typeof item.url === 'string' && typeof item.y === 'number' && Number.isFinite(item.y)
      && item.y >= 0 && item.y < 10000000 && recent(item.at, 1)) : [];
  } catch { return []; }
};
export const getListPosition = (url: string) => readListPositions().find(item => item.url === url)?.y || 0;
export const saveListPosition = (url: string, y: number) => {
  safeSessionStorage.setItem(LIST_KEY, JSON.stringify([
    ...readListPositions().filter(item => item.url !== url), { url, y, at: Date.now() },
  ].slice(-20)));
};
export const forgetListPosition = (url: string) => {
  safeSessionStorage.setItem(LIST_KEY, JSON.stringify(readListPositions().filter(item => item.url !== url)));
};
