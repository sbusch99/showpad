import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material.module';
import { ButtonSpinnerComponent } from './button-spinner/button-spinner.component';
import { LoggerModule } from 'ngx-logger';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LuxonModule } from 'luxon-angular';

const components = [ButtonSpinnerComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [
    ...components,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    LoggerModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    LuxonModule,
  ],
})
export class SharedModule {}
