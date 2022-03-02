import { FormControl, FormGroup } from '@angular/forms';
import { BaseSubscriptionsDirective } from '../base-subscriptions/base-subscriptions.directive';
import { AnyObject } from '../record-types';

import { BaseFormInit, BaseFormSuper } from './base-form.model';

/**
 * Not an Angular Component, but a base class for safe form building
 */
export class BaseFormComponent<FormModel extends AnyObject> extends BaseSubscriptionsDirective {
  form!: FormGroup;
  model!: FormModel;

  constructor(public bf: BaseFormSuper) {
    super();
  }

  /**
   * @return typesafe form control
   */
  get controls(): Record<keyof FormModel, FormControl> {
    return this.form.controls as Record<keyof FormModel, FormControl>;
  }

  /**
   * @return typesafe form.value, which will contain all the control values
   */
  get formValue(): FormModel {
    return this.form.value as FormModel;
  }

  /**
   * typesafe use of formControlName
   *
   * @param formControlName [formControlName]="safeCol('safeName')"
   * @return safe name
   */
  safeCol(formControlName: keyof FormModel): keyof FormModel {
    return formControlName;
  }

  /**
   * typesafe form creation
   */
  formCreate(model: FormModel, bfi?: Partial<BaseFormInit>): void {
    const { fb } = this.bf;
    let map!: Map<string, string[]>;

    /*
     * form builder doesn't know about arrays (unless you pass in FormControl):
     *  * it will initialize the control with null
     *  * if the array is non-zero in length, the formbuilder will throw an exception
     */
    for (const key in model) {
      if (model.hasOwnProperty(key) && Array.isArray(model[key])) {
        if (!map) {
          map = new Map<string, string[]>();
        }

        const array: any[] = (model as any)[key];

        map.set(key, array.slice()); // keep a copy

        if (array.length > 0) {
          array.length = 0; // if not set, then formbuilder fails
        }
      }
    }

    this.model = model;
    this.form = fb.group(model);

    if (map) {
      for (const [key, value] of map) {
        if (value.length > 0) {
          (model as any)[key] = value; // put the contents back in the model
        }
        this.controls[key].setValue(value, { emitEvent: false });
      }
    }

    if (bfi?.validators) {
      this.form.setValidators(bfi.validators);
    }
  }

  /**
   * form.reset, resets the form to blank fields. This methods
   * resets the values used in #formCreate
   */
  formReset(): void {
    this.form.patchValue(this.model);
  }

  /**
   * typesafe update to the form
   */
  formUpdate(
    model: Partial<FormModel>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    },
  ): void {
    this.form.patchValue(model, options);
  }
}
