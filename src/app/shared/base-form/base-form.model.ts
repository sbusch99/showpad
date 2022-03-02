import { AbstractControlOptions, FormBuilder, ValidatorFn } from '@angular/forms';

export interface BaseFormSuper {
  fb: FormBuilder;
}

export interface BaseFormInit {
  group: unknown;
  options: AbstractControlOptions | { [key: string]: any } | null;
  validators?: ValidatorFn | ValidatorFn[] | null;
}
