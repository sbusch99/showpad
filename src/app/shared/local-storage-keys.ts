import { SortDirection } from '@angular/material/sort';

export type LocalStorageKey = 'lastRoute' | 'theme';

export const localStorageKeys: Record<LocalStorageKey, string> = {
  lastRoute: 'last-route',
  theme: 'docs-theme-storage-current',
};

export interface GenericTableStore<T = string> {
  hidden?: T[];
  pageIndex: number;
  pageSize: number;
  sortColumn: T;
  sortDirection: SortDirection;
}

export interface GenericStoreWithTable<T = string> {
  table: GenericTableStore<T>;
}
