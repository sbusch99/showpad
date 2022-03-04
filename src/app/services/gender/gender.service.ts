import { Injectable } from '@angular/core';
import { AppService } from '../app/app.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, tap } from 'rxjs';
import { GenderModel, GenderType } from '../../models/gender.model';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  readonly url = `${this.app.url}/gender`;
  readonly map = new Map<string, GenderType>();

  constructor(
    private readonly app: AppService,
    private readonly http: HttpClient,
  ) {}

  getAll(): Observable<any> {
    const { http, url, map } = this;
    const genders: GenderType[] = ['male', 'female', 'genderless'];
    const observables = genders.map((gender) =>
      http.get<GenderModel>(`${url}/${gender}`).pipe(
        tap((resp) => {
          for (const detail of resp.pokemon_species_details) {
            map.set(detail.pokemon_species.name, gender);
          }
        }),
      ),
    );

    return forkJoin(observables);
  }

  get(name: string): GenderType {
    return this.map.get(name) || 'genderless';
  }
}
