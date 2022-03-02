import * as fde from 'fast-deep-equal';
import { UnknownObject } from './record-types';

export class Utils {
  /**
   * Highly performant deep equal
   *
   * @param a unknown object
   * @param b unknown object
   * @return true contents(a) equals contents(b) or a=falsy and b=falsy
   */
  static deepEqual(a: UnknownObject, b: UnknownObject): boolean {
    if (a && b) {
      return fde(a, b);
    } else {
      return !a && !b; // if both are falsy, return true
    }
  }
}
