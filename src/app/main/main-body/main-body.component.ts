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

  readonly bs: BaseStore<PokeStore>;
  private readonly _items: KeyValueMenuItem<PokeView>[] = [
    { key: 'id', value: { label: 'app.models.poke.columns.id' } },
    { key: 'name', value: { label: 'app.models.poke.columns.name' } },
  ];

  constructor(private storeService: StoreService, private logger: NGXLogger) {
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
  }

  ngAfterViewInit(): void {
    const { sort, destroy$, dataSource } = this;

    dataSource.sort = sort;

    sort.sortChange
      .pipe(takeUntil(destroy$))
      .subscribe(() => this.tableSaveSort(sort));
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
}
