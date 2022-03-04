import { Injectable } from '@angular/core';
import { AppService } from '../app/app.service';
import { forkJoin, map, Observable, of, Subject, take, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CatchWishModel, PokemonModel } from '../../models/pokemon.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { GenderService } from '../gender/gender.service';
import { MainFacetModel } from '../../main/main-facet/main-facet-model';
import { StoreService } from '../store/store.service';
import { localStorageKeys } from '../../shared/local-storage-keys';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  readonly url = `${this.app.url}/pokemon`;
  rows: PokemonModel[] = [];
  readonly dataChanged = new Subject<void>();
  filtered: PokemonModel[] = [];
  totalRows = 0;

  private sort: Sort = {
    direction: 'desc',
    active: '',
  };
  private filter: MainFacetModel = {
    genders: [],
    name: '',
    catches: false,
    wishes: false,
  };

  constructor(
    private readonly app: AppService,
    private readonly http: HttpClient,
    private readonly genderService: GenderService,
    private readonly storeService: StoreService,
  ) {}

  getAll(): Observable<PokemonModel[]> {
    interface Resp {
      count: number;
      next: string;
      results: PokemonModel[];
    }

    const { http, url, storeService } = this;
    const params = new HttpParams().set('offset', 0).set('limit', '2048');
    const catchWish = storeService.getObject<CatchWishModel>(
      localStorageKeys.catchWish,
      {
        catches: [],
        wishes: [],
      },
    );

    return http.get<Resp>(url, { params }).pipe(
      take(1),
      map((resp) => {
        for (const row of resp.results) {
          row.id = row.name;

          try {
            row.catch = catchWish?.catches.includes(row.name) || false;
            row.wish = catchWish?.wishes.includes(row.name) || false;
          } catch {
            row.catch = row.wish = false;
          }
        }

        this.rows = this.filtered = resp.results;
        this.totalRows = this.rows.length;
        return resp.results;
      }),
    );
  }

  get({
    page,
    sort,
    filter,
  }: {
    page: MatPaginator;
    sort: MatSort;
    filter: MainFacetModel;
  }): Observable<PokemonModel[]> {
    const { rows } = this;

    if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
      this.filter = JSON.parse(JSON.stringify(filter));
      this.filtered = rows.filter((row) => {
        if (filter.genders.length && !filter.genders.includes(row.gender)) {
          return false;
        }

        if (filter.name && !row.name.includes(filter.name)) {
          return false;
        }

        if (filter.wishes && filter.catches) {
          if (!row.wish && !row.catch) {
            return false;
          }
        } else {
          if (filter.wishes && !row.wish) {
            return false;
          }

          if (filter.catches && !row.catch) {
            return false;
          }
        }

        return true;
      });
    }

    if (
      this.sort.active !== sort.active ||
      this.sort.direction !== sort.direction
    ) {
      this.sort.active = sort.active;
      this.sort.direction = sort.direction;
      this.sortData(this.rows);
      this.sortData(this.filtered);
    }

    const { filtered } = this;
    const index = page.pageSize * page.pageIndex;
    const res = filtered.slice(index, index + page.pageSize);

    page.length = filtered.length;

    return of(res);
  }

  getGenders(): void {
    const { genderService } = this;

    for (const row of this.rows) {
      row.gender = genderService.get(row.name) || 'genderless';
    }
  }

  private sortData(rows: PokemonModel[]): void {
    const { sort } = this;

    if (rows.length <= 1 || !sort.active) {
      return;
    }

    const active = sort.active as keyof PokemonModel;
    const dir = sort.direction === 'asc' ? 1 : -1;
    const compareId: (a: PokemonModel, b: PokemonModel) => number = (
      a: PokemonModel,
      b: PokemonModel,
    ) => a.name.localeCompare(b.name);

    switch (active) {
      case 'name':
        rows.sort((a, b) => dir * compareId(a, b));
        break;
      default:
        rows.sort((a, b) => {
          const aVal = a[active] ?? '';
          const bVal = b[active] ?? '';

          return (
            dir *
            (aVal.toString().localeCompare(bVal.toString()) || compareId(a, b))
          );
        });
    }
  }
}
