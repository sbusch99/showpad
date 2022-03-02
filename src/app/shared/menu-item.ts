import { KeyValue } from '@angular/common';
import { FormControl } from '@angular/forms';

/**
 * A generic item, that can be used in menus, tables, etc. It can be also extended'
 */
export interface MenuItem_<T> {
  alignRight: boolean;
  count: number;
  disabled: boolean;
  disabledText: string;
  formControl: FormControl;
  hidden: boolean;
  icon: string;
  iconFA: string;
  items: KeyValueMenuItem<T>[] | Record<string, KeyValueMenuItem<T>>;
  label: string;
  route: string;
  tooltip: string;
  unsortable: boolean;
}

export type MenuItem<T> = Partial<MenuItem_<T>>; // Use MenuItem vs MenuItem_
export type KeyValueMenuItem<T = string> = KeyValue<T, MenuItem<T>>;
