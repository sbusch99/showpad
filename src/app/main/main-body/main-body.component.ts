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
import { forkJoin } from 'rxjs';
import { GenderService } from '../../services/gender.service';

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
    {
      key: 'gender',
      value: { label: 'app.models.poke.columns.gender' },
    },
  ];

  constructor(
    private readonly storeService: StoreService,
    private readonly logger: NGXLogger,
    private readonly pokemonService: PokemonService,
    private readonly genderService: GenderService,
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
    super.ngOnInit();

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
      genderService,
    } = this;

    dataSource.sortData = (d) => d; // disable f/e sorting and do NOT define dataSource.paginator
    dataSource.sort = sort;

    paginator.page.pipe(takeUntil(destroy$)).subscribe((page: PageEvent) => {
      const changed = tableStore.pageSize !== page.pageSize;

      if (changed) {
        tableStore.pageSize = page.pageSize;
        this.tableSave();
      }
      this.getCollection(changed);
    });

    sort.sortChange.pipe(takeUntil(destroy$)).subscribe(() => {
      this.tableSaveSort(sort);
      this.getCollection();
    });

    forkJoin([pokemonService.getAll(), genderService.getAll()]).subscribe(
      () => {
        pokemonService.getGenders();
        this.busy$.next(false);
        this.getCollection();
      },
    );
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
  private getCollection(firstPage = false): void {
    const { dataSource, sort, paginator, tableStore, pokemonService } = this;

    if (firstPage) {
      paginator.pageIndex = 0;
      tableStore.pageSize = paginator.pageSize;
    }

    pokemonService.get({ page: paginator, sort }).subscribe((rows) => {
      dataSource.data = rows.map((rawData) => {
        return {
          name: rawData.name,
          gender: rawData.gender,
          id: rawData.id,
          rawData,
        };
      });
    });
  }
}
