import { Injectable } from '@angular/core';
import { AppService } from '../app/app.service';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  ReplaySubject,
  take,
} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PokeModel } from '../../models/poke.model';
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  readonly url = `${this.app.url}/pokemon`;
  rows!: PokeModel[];

  constructor(
    private readonly app: AppService,
    private readonly http: HttpClient,
  ) {}

  getAll(): Observable<PokeModel[]> {
    interface Resp {
      count: number;
      next: string;
      results: PokeModel[];
    }

    const { http, url } = this;
    const params = new HttpParams().set('offset', 0).set('limit', '2048');

    return http.get<Resp>(url, { params }).pipe(
      take(1),
      map((resp) => {
        for (const row of resp.results) {
          row.id = row.url.substring(this.url.length + 1);
          row.id = row.id.substring(0, row.id.indexOf('/'));
          row.name = row.name[0].toUpperCase() + row.name.substring(1);
        }

        this.rows = resp.results;

        return resp.results;
      }),
    );
  }

  get(page: MatPaginator): Observable<PokeModel[]> {
    const { rows } = this;
    const index = page.pageSize * page.pageIndex;
    const res = rows.slice(index, index + page.pageSize);

    return of(res);
  }
}
