export interface BaseTableOptions<ColumnView> {
  /** action column */
  action: boolean;

  /** if implementing defaultHidden, then implement get/set tableStore  */
  defaultHidden: ColumnView[];

  /** select (checkbox) column */
  select: boolean;
}

/**
 * Best practice: the model for each row should always contain the raw data. The other attributes are for the table view. This
 * way action events, such as row select/delete have context.
 */
export interface BaseTableModel<T> {
  rawData: T;
}

export type BaseTableView = 'action' | 'select';
