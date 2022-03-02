import { Directive, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * RxJS related stuff. Destroy subscriptions to eliminate memory leaks.
 */
@Directive()
export class BaseSubscriptionsDirective implements OnDestroy {
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
