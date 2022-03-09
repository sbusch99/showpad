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
import { GenderService } from '../../services/gender/gender.service';
import { MainFacetModel } from '../main-facet/main-facet-model';
import { CatchWishModel } from '../../models/pokemon.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export type Action = 'catch' | 'wish';

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
    { key: 'name', value: { label: 'app.models.pokemon.columns.name' } },
    {
      key: 'gender',
      value: { label: 'app.models.pokemon.columns.gender' },
    },
  ];
  private filter: MainFacetModel = {
    genders: [],
    name: '',
    catches: false,
    wishes: false,
  };

  constructor(
    private readonly storeService: StoreService,
    private readonly logger: NGXLogger,
    readonly pokemonService: PokemonService,
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

  action(action: Action, ...rx: PokeTableModel[]): void {
    const { storeService, pokemonService } = this;
    const { rows } = pokemonService;

    for (const row of rx) {
      switch (action) {
        case 'catch':
          row.rawData.catch = !row.rawData.catch;
          break;
        case 'wish':
          row.rawData.wish = !row.rawData.wish;
          break;
        default:
          throw new Error(`Unexpected action: ${action}`);
      }
    }

    const wishes = rows.filter((r) => r.wish).map((r) => r.name);
    const catches = rows.filter((r) => r.catch).map((r) => r.name);

    storeService.setObject<CatchWishModel>(localStorageKeys.catchWish, {
      catches,
      wishes,
    });

    this.pokemonService.dataChanged.next();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex,
    );

    this.bs.store.table.order = this.displayedColumns as PokeView[];
    this.tableSave();
  }
  setFilter(event: MainFacetModel): void {
    this.filter = event;
    this.getCollection(true);
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

  private getCollection(firstPage = false): void {
    const { dataSource, sort, paginator, tableStore, pokemonService, filter } =
      this;

    if (firstPage) {
      paginator.pageIndex = 0;
      tableStore.pageSize = paginator.pageSize;
    }

    pokemonService.get({ page: paginator, sort, filter }).subscribe((rows) => {
      dataSource.data = rows.map((rawData) => ({ rawData }));
    });
  }
}
