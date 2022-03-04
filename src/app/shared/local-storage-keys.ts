export type LocalStorageKey = 'catchWish' | 'lastRoute' | 'theme' | 'poke';

export const localStorageKeys: Record<LocalStorageKey, string> = {
  catchWish: 'catchWish',
  lastRoute: 'last-route',
  poke: 'poke',
  theme: 'docs-theme-storage-current',
};
