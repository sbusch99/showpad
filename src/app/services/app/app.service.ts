import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly url: string;

  constructor() {
    const { api } = environment;

    this.url = `${api.uri}/${api.version}/`;
  }
}
