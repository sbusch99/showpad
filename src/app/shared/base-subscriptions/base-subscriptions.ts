import { Directive, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Constructor } from '@angular/material/core/common-behaviors/constructor';

function Scale<TBase extends Constructor<{}>>(Base: TBase) {
  return class Scaling extends Base {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    _scale = 1;

    get scale(): number {
      return this._scale;
    }

    setScale(scale: number) {
      this._scale = scale;
    }
  };
}

@Directive()
export class BaseSubscriptions implements OnDestroy {
  readonly busy$ = new BehaviorSubject<boolean>(false);
  readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    const { destroy$, busy$ } = this;

    destroy$.next();
    destroy$.complete();
    busy$.next(false);
    busy$.complete();
  }
}
