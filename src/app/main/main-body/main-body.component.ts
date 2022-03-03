import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { MatSort } from '@angular/material/sort';
import { BaseStore } from '../../shared/base-store/base-store';
import {
  PokeStore,
  PokeTableModel,
  PokeView,
  tableStoreDefault,
} from './main-body.model';
import { KeyValueMenuItem } from '../../shared/menu-item';
import { BaseTableDirective } from '../../shared/base-table/base-table.directive';
import { StoreService } from '../../services/store/store.service';
import { localStorageKeys } from '../../shared/local-storage-keys';
import { GenericTableStore } from '../../shared/generic-store';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PokemonService } from '../../services/pokemon/pokemon.service';

export type Action = 'charge' | 'move' | 'toggle' | 'batch';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.scss'],
})
export class MainBodyComponent
  extends BaseTableDirective<PokeTableModel, PokeView>
  implements OnInit, AfterViewInit
{
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly bs: BaseStore<PokeStore>;
  private readonly _items: KeyValueMenuItem<PokeView>[] = [
    { key: 'name', value: { label: 'app.models.poke.columns.name' } },
  ];

  constructor(
    private readonly storeService: StoreService,
    private readonly logger: NGXLogger,
    private readonly pokemonService: PokemonService,
  ) {
    super({
      action: true,
      select: false,
      defaultHidden: tableStoreDefault.table.hidden,
    });

    this.bs = new BaseStore<PokeStore>(
      localStorageKeys.poke,
      tableStoreDefault,
      storeService,
    );
    this.bs.validateStore();
  }

  get items(): KeyValueMenuItem<PokeView>[] {
    return this._items;
  }

  override get tableStore(): GenericTableStore<PokeView> {
    return this.bs.store.table;
  }

  override set tableStore(table: GenericTableStore<PokeView>) {
    this.bs.store.table = table;
  }

  action(action: Action, ...rows: PokeTableModel[]): void {
    const { logger } = this;

    for (const row of rows) {
      switch (action) {
        case 'charge':
          logger.debug(action, row);
          break;
        case 'move':
          logger.debug(action, row);
          break;
        case 'toggle':
          logger.debug(action, row);
          break;
        default:
          throw new Error(`Unexpected action: ${action}`);
      }
    }
  }

  override ngOnInit(): void {
    const { dataSource } = this;

    super.ngOnInit();

    dataSource.sortData = this.sortData;
    this.busy$.next(true);
  }

  ngAfterViewInit(): void {
    const {
      paginator,
      sort,
      destroy$,
      dataSource,
      tableStore,
      pokemonService,
    } = this;

    dataSource.sort = sort;

    paginator.page.pipe(takeUntil(destroy$)).subscribe((page: PageEvent) => {
      const changed = tableStore.pageSize !== page.pageSize;

      if (changed) {
        tableStore.pageSize = page.pageSize;
        this.tableSave();
      }
      this.getCollection(changed);
    });

    sort.sortChange
      .pipe(takeUntil(destroy$))
      .subscribe(() => this.tableSaveSort(sort));

    pokemonService.getAll().subscribe(() => {
      this.paginator.length = pokemonService.rows.length;
      this.busy$.next(false);
      this.getCollection();
    });
  }

  override tableSave(): void {
    this.storeService.setObject<PokeStore>(this.bs.storeKey, this.bs.store);
  }

  /**
   * Sort the data. "this" is MatTableDataSource - not PokeComponent.
   *
   * @param data rows of data
   * @param sort sort data
   * @return the sorted data
   */
  private sortData(data: PokeTableModel[], sort: MatSort): PokeTableModel[] {
    if (data.length <= 1 || !sort.active) {
      return data;
    }

    const active = sort.active as PokeView;
    const dir = sort.direction === 'asc' ? 1 : -1;
    const compareId: (a: PokeTableModel, b: PokeTableModel) => number = (
      a: PokeTableModel,
      b: PokeTableModel,
    ) => a.rawData.id.localeCompare(b.rawData.id);

    switch (active) {
      case 'id':
        data.sort((a, b) => dir * compareId(a, b));
        break;
      default:
        data.sort((a, b) => {
          const aVal = a[active] ?? '';
          const bVal = b[active] ?? '';

          return (
            dir *
            (aVal.toString().localeCompare(bVal.toString()) || compareId(a, b))
          );
        });
    }
    return data;
  }

  private getCollection(firstPage = false): void {
    const { dataSource, sort, busy$, paginator, tableStore, pokemonService } =
      this;

    if (firstPage) {
      paginator.pageIndex = 0;
      tableStore.pageSize = paginator.pageSize;
    }

    pokemonService.get(paginator).subscribe((rows) => {
      dataSource.data = rows.map((rawData) => {
        return {
          name: rawData.name,
          id: rawData.id,
          rawData,
        };
      });
    });
  }
}
