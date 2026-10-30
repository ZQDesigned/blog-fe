import { useRef, useCallback, useEffect } from 'react';

interface CacheEntry {
  key: string;
  promise: Promise<unknown>;
  controller: AbortController;
  pending: boolean;
  expiresAt: number;
  consumers: Set<Set<CacheEntry>>;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TIME = 2000;

const releaseConsumers = (entry: CacheEntry) => {
  entry.consumers.forEach(consumer => consumer.delete(entry));
  entry.consumers.clear();
};

export function useDedupeRequest() {
  const ownedEntries = useRef(new Set<CacheEntry>());

  useEffect(() => {
    const consumer = ownedEntries.current;
    return () => {
      consumer.forEach(entry => {
        entry.consumers.delete(consumer);
        // StrictMode may immediately resubscribe during effect replay.
        queueMicrotask(() => {
          if (entry.pending && entry.consumers.size === 0 && cache.get(entry.key) === entry) {
            cache.delete(entry.key);
            entry.controller.abort();
          }
        });
      });
      consumer.clear();
    };
  }, []);

  return useCallback(<T>(
    key: string,
    requestFn: (signal: AbortSignal) => Promise<T>,
  ): Promise<T> => {
    const current = cache.get(key);
    const consumer = ownedEntries.current;
    if (current && (current.pending || current.expiresAt > Date.now())) {
      if (current.pending) {
        current.consumers.add(consumer);
        consumer.add(current);
      }
      return current.promise as Promise<T>;
    }

    const controller = new AbortController();
    const promise = Promise.resolve()
      .then(() => requestFn(controller.signal))
      .then(data => {
        entry.pending = false;
        releaseConsumers(entry);
        entry.expiresAt = Date.now() + CACHE_TIME;
        setTimeout(() => {
          if (cache.get(key) === entry) cache.delete(key);
        }, CACHE_TIME);
        return data;
      }, error => {
        entry.pending = false;
        releaseConsumers(entry);
        if (cache.get(key) === entry) cache.delete(key);
        throw error;
      });

    const entry: CacheEntry = {
      key,
      promise,
      controller,
      pending: true,
      expiresAt: 0,
      consumers: new Set([consumer]),
    };
    consumer.add(entry);
    cache.set(key, entry);
    return promise;
  }, []);
}
