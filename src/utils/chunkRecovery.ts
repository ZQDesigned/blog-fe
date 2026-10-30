import { safeSessionStorage } from './storage';

interface ChunkFailure { error: unknown; fatal: boolean }
const listeners = new Set<() => void>();
let failure: ChunkFailure | null = null;
let installed = false;
const RELOAD_KEY = 'chunk-recovery-reload:v1';
const build = import.meta.env.VITE_GIT_HASH || 'development';

export const isChunkLoadError = (error: unknown): boolean => {
  if (failure && failure.error === error) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|importing a module script failed|loading (?:css )?chunk|unable to preload css|error loading dynamically imported module|failed to (?:fetch|load) module script/i.test(message);
};
export const reportChunkFailure = (error: unknown, fatal = false) => {
  failure = { error, fatal: fatal || Boolean(failure?.fatal) };
  listeners.forEach(listener => listener());
};
export const installChunkRecovery = () => {
  if (installed) return;
  installed = true;
  // Do not swallow the rejection: React's boundary must still handle a failed lazy component.
  window.addEventListener('vite:preloadError', event => {
    reportChunkFailure((event as Event & { payload: unknown }).payload);
  });
};
export const subscribeChunkFailure = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const getChunkFailure = () => failure;
export const dismissChunkFailure = () => {
  if (failure?.fatal) return;
  failure = null;
  listeners.forEach(listener => listener());
};
export const canReloadChunk = () => {
  try {
    const previous = JSON.parse(safeSessionStorage.getItem(RELOAD_KEY) || 'null');
    return !previous || previous.build !== build || previous.url !== window.location.href
      || typeof previous.at !== 'number' || !Number.isFinite(previous.at)
      || Date.now() < previous.at || Date.now() - previous.at >= 60000;
  } catch { return true; }
};
export const reloadForChunk = () => {
  if (!navigator.onLine || !canReloadChunk()) return false;
  safeSessionStorage.setItem(RELOAD_KEY, JSON.stringify({ build, url: window.location.href, at: Date.now() }));
  window.location.reload();
  return true;
};
