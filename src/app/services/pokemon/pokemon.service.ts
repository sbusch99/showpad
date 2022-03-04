import { Injectable } from '@angular/core';
import { AppService } from '../app/app.service';
import { forkJoin, map, Observable, of, take, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PokemonModel } from '../../models/pokemon.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { GenderService } from '../gender/gender.service';
import { MainFacetModel } from '../../main/main-facet/main-facet-model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  readonly url = `${this.app.url}/pokemon`;
  rows: PokemonModel[] = [];
  filtered: PokemonModel[] = [];
  totalRows = 0;

  private sort: Sort = {
    direction: 'desc',
    active: '',
  };
  private filter: MainFacetModel = {
    genders: [],
    name: '',
  };

  constructor(
    private readonly app: AppService,
    private readonly http: HttpClient,
    private readonly genderService: GenderService,
  ) {}

  getAll(): Observable<PokemonModel[]> {
    interface Resp {
      count: number;
      next: string;
      results: PokemonModel[];
    }

    const { http, url } = this;
    const params = new HttpParams().set('offset', 0).set('limit', '2048');

    return http.get<Resp>(url, { params }).pipe(
      take(1),
      map((resp) => {
        for (const row of resp.results) {
          row.id = row.url;
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
      this.filter.name = filter.name;
      this.filter.genders = filter.genders;

      if (!filter.name && filter.genders.length === 0) {
        this.filtered = rows.slice();
      } else {
        this.filtered = rows.filter((row) => {
          if (filter.genders.length) {
            if (!filter.genders.includes(row.gender)) {
              return false;
            }
          }

          if (filter.name) {
            if (!row.name.includes(filter.name)) {
              return false;
            }
          }

          return true;
        });
      }
    }

    if (
      this.sort.active !== sort.active ||
      this.sort.direction !== sort.direction
    ) {
      this.sort.active = sort.active;
      this.sort.direction = sort.direction;
      this.sortData();
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

  private sortData(): void {
    const { rows, sort } = this;

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
