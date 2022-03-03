export type LocalStorageKey = 'lastRoute' | 'theme' | 'poke';

export const localStorageKeys: Record<LocalStorageKey, string> = {
  lastRoute: 'last-route',
  poke: 'poke',
  theme: 'docs-theme-storage-current',
};
