import { SelectionModel } from '@angular/cdk/collections';
import { Directive, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';

import { HasTableStore } from '../../services/store/store.model';
import { BaseSubscriptionsDirective } from '../base-subscriptions/base-subscriptions.directive';
import { GenericTableStore } from '../local-storage-keys';
import { KeyValueMenuItem } from '../menu-item';
import { AnyObject } from '../record-types';
import { BaseTableOptions, BaseTableView } from './base-table.model';

/**
 * this is an abstract class. get items needs to be implemented
 */
@Directive()
export abstract class BaseTableDirective<
    DataModel extends AnyObject,
    ColumnView,
  >
  extends BaseSubscriptionsDirective
  implements HasTableStore<ColumnView>, OnInit
{
  readonly dataSource = new MatTableDataSource<DataModel>([]);
  /** standardize on 'select',  visible columns, 'action'   */
  displayedColumns: (ColumnView | BaseTableView)[] = [];
  readonly selection = new SelectionModel<DataModel>(true, []);

  // this is protected b/c it's an abstract class
  protected constructor(
    public readonly baseOptions: Partial<BaseTableOptions<ColumnView>> = {},
  ) {
    super();
  }

  /**
   * need to  implement
   */
  abstract get items(): KeyValueMenuItem<ColumnView>[];

  /**
   * the rows that are selected
   */
  get selected(): DataModel[] {
    return this.selection.selected;
  }

  /**
   * set baseOptions.defaultHidden and then get/set
   */
  get tableStore(): GenericTableStore<ColumnView> {
    throw new Error('get tableSbore() needs to be implemented');
  }

  /**
   * set baseOptions.defaultHidden and then get/set
   */
  set tableStore(table: GenericTableStore<ColumnView>) {
    throw new Error('set tableSbore() needs to be implemented');
  }

  /**
   * typesafe column in html
   *
   * @param c typesafe column
   * @return typesafe column
   */
  safeCol(c: ColumnView | BaseTableView): ColumnView | BaseTableView {
    return c;
  }

  /**
   * typesafe row in html
   *
   * @param row row in html
   * @return typesafe row
   */
  safeRow(row: any): DataModel {
    return row;
  }

  ngOnInit(): void {
    if (this.displayedColumns.length === 0 && this.items.length > 0) {
      this.setDisplayedColumns();
    }
  }

  selectIsAllSelected(): boolean {
    return this.selected.length === this.dataSource.data.length;
  }

  selectMasterToggle(): void {
    if (this.selectIsAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

  /**
   * Set, reset or set all displayed columns via the "gear" control
   *
   * @param option 'all' | 'set' | 'reset'
   */
  setDisplayedColumns(option: 'all' | 'set' | 'reset' = 'set'): void {
    const { baseOptions, items, destroy$ } = this;
    const { defaultHidden } = baseOptions;
    const columns: (ColumnView | BaseTableView)[] = [];
    const allReset = option === 'all' || option === 'reset';

    // Fail-safe test to make sure this only executes appropriately.
    if (
      Array.isArray(defaultHidden) &&
      (!items[0].value.formControl || allReset)
    ) {
      const { tableStore: table } = this;

      if (allReset) {
        table.hidden = option === 'all' ? [] : defaultHidden.slice();
        this.tableStore = table;
        this.tableSave();
      }

      for (const item of items) {
        const { value } = item;

        // @ts-ignore lint is generating a false positive
        value.hidden = table.hidden.includes(item.key);

        if (allReset) {
          // @ts-ignore
          value.formControl.setValue(!value.hidden, { emitEvent: false });
        } else {
          value.formControl = new FormControl(!value.hidden);

          value.formControl.valueChanges
            .pipe(takeUntil(destroy$))
            .subscribe((v: boolean) => {
              value.hidden = !v;
              table.hidden = items
                .filter((f) => f.value.hidden)
                .map((f) => f.key);
              this.tableStore = table;
              this.tableSave();
              this.setDisplayedColumns();
            });
        }
      }
    }

    if (baseOptions.select) {
      columns.push('select');
    }

    columns.push(...items.filter((f) => !f.value.hidden).map((f) => f.key));

    if (baseOptions.action) {
      columns.push('action');
    }

    this.displayedColumns = columns;
  }

  tableSave(): void {
    throw new Error('tableSave() needs to be implemented');
  }

  tableSaveSort(sort: Sort): void {
    const { tableStore } = this;
    const { active, direction } = sort;

    tableStore.sortDirection = direction;
    tableStore.sortColumn = active as any;
    this.tableSave();
  }
}
