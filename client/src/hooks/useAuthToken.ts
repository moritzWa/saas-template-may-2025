import { useSyncExternalStore } from 'react';

function getSnapshot(): string | null {
  return localStorage.getItem('accessToken');
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

/**
 * SSR-safe hook to get the auth token from localStorage.
 * Returns null on server and during hydration, then the actual token on client.
 */
export function useAuthToken(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns true once the component has mounted on the client.
 * Useful for avoiding hydration mismatches.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
