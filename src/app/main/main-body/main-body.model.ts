import { PokemonModel } from '../../models/pokemon.model';
import { BaseTableModel } from '../../shared/base-table/base-table.model';
import { GenericStoreWithTable } from '../../shared/generic-store';

/**
 * What's on the screen right now
 */
export interface PokeTableModel extends BaseTableModel<PokemonModel> {}

export type PokeView =
  | keyof Omit<PokeTableModel, 'rawData'>
  | 'gender'
  | 'name';
export type PokeStore = GenericStoreWithTable<PokeView>;

export const tableStoreDefault: PokeStore = {
  table: {
    hidden: [],
    pageIndex: 0,
    pageSize: 10,
    sortColumn: 'name',
    sortDirection: 'asc',
  },
};
