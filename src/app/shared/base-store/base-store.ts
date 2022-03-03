import { StoreService } from '../../services/store/store.service';
import { AnyObject } from '../record-types';

/**
 * Manage a safe local store
 */
export class BaseStore<Model extends AnyObject> {
  private traverseValid = true;

  constructor(
    public readonly storeKey: string,
    public readonly modelDefault: Model,
    public readonly baseStoreService: StoreService,
  ) {
    this.storeGet();
  }

  private _store!: Model;

  get store(): Model {
    return this._store;
  }

  set store(store: Model) {
    this._store = store;
  }

  storeGet(): void {
    const { storeKey, modelDefault, baseStoreService } = this;

    // lint complains, even thought modelDefault forces a non-null response
    this.store =
      baseStoreService.getObject<Model>(storeKey, modelDefault) || modelDefault;
  }

  storeSave(): void {
    const { storeKey, store, baseStoreService } = this;

    baseStoreService.setObject<Model>(storeKey, store);
  }

  /**
   * Traverse the store and see if it's malformed vs. obj, which is defined as well formed.
   * If malformed, then fix it.
   *
   * @param obj well formed object
   * @param store possibly malformed object
   */
  traverse(obj: AnyObject, store: AnyObject | null): void {
    if (!store) {
      return;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          if (!Array.isArray(store[key])) {
            // the store was malformed b/c it wasn't an array. fix it.
            this.traverseValid = false;
            store[key] = obj[key].slice();
          }
        } else if (typeof obj[key] === 'object') {
          if (typeof store[key] !== 'object') {
            // the store was malformed b/c it wasn't an object. fix it.
            this.traverseValid = false;
            store[key] = Object.assign({}, obj[key]);
          }
          this.traverse(obj[key], store[key]);
        }
      }
    }
  }

  validateStore(): boolean {
    const { store, modelDefault } = this;

    this.traverseValid = true;
    this.traverse(modelDefault, store);

    return this.traverseValid;
  }
}
