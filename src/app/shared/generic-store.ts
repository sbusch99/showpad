import { SortDirection } from '@angular/material/sort';

export interface GenericTableStore<T = string> {
  hidden?: T[];
  order?: T[];
  pageIndex: number;
  pageSize: number;
  sortColumn: T;
  sortDirection: SortDirection;
}

export interface GenericStoreWithTable<T = string> {
  table: GenericTableStore<T>;
}
