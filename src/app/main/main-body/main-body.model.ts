import { PokeModel } from '../../models/poke.model';
import { BaseTableModel } from '../../shared/base-table/base-table.model';
import { GenericStoreWithTable } from '../../shared/generic-store';

/**
 * What's on the screen right now
 */
export interface PokeTableModel extends BaseTableModel<PokeModel> {
  name: string;
}

export type PokeView = keyof Omit<PokeTableModel, 'rawData'>;
export type PokeStore = GenericStoreWithTable<PokeView>;

export const tableStoreDefault: PokeStore = {
  table: {
    hidden: [],
    pageIndex: 0,
    pageSize: 20,
    sortColumn: 'name',
    sortDirection: 'asc',
  },
};
