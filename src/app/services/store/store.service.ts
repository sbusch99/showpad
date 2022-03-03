import { Injectable } from '@angular/core';

import { AnyObject } from '../../shared/record-types';
import { Utils } from '../../shared/utils';

/**
 * Wrapper around localStorage
 */
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  get(key: string, defaultValue?: string): string | null {
    let result: string | null = localStorage.getItem(key);

    if (!result && defaultValue) {
      result = defaultValue;
      localStorage.setItem(key, defaultValue);
    }

    return result;
  }

  getObject<T extends AnyObject>(key: string, defaultValue?: T): T | null {
    const item: string | null = localStorage.getItem(key);
    let result: T | null = null;

    if (item) {
      try {
        result = JSON.parse(item); // try/catch for crappy data
      } catch (e) {}
    }

    if (defaultValue) {
      if (result) {
        const withMissing: T = Object.assign({}, defaultValue, result);

        if (!Utils.deepEqual(result, withMissing)) {
          result = withMissing;
          this.setObject(key, result); // write the object back if some fields are missing
        }
      } else {
        result = defaultValue;
        this.setObject(key, defaultValue);
      }
    }

    return result;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  setObject<T extends AnyObject>(key: string, value: T | null): void {
    if (value) {
      this.set(key, JSON.stringify(value));
    }
  }
}
