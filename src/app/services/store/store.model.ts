import { GenericTableStore } from '../../shared/generic-store';

export interface HasTableStore<T> {
  /*  implement as a get */
  tableStore: GenericTableStore<T>;
}

export interface HasFacetStore<T> {
  /*  implement as a get */
  facetStore: T;
}
