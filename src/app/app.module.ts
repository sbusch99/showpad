import { ErrorHandler, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { INGXLoggerConfig, LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { GlobalErrorHandler } from './shared/error-handler/error-handler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

const loggerConfig: INGXLoggerConfig = {
  level: environment.ngxLoggerLevel,
  disableConsoleLogging: false,
  colorScheme: ['purple', 'teal', 'gray', 'gray', 'red', 'red', 'red'],
};

/**
 * For example, in ./assets/translate/, app.en.json, shared.en.json, app.es.json, shared.es.json
 */
const translateProvider: Provider = {
  provide: TranslateLoader,
  useFactory: (http: HttpClient) =>
    new MultiTranslateHttpLoader(http, [
      { prefix: './assets/translate/app.', suffix: '.json' },
      { prefix: './assets/translate/shared.', suffix: '.json' },
    ]),
  deps: [HttpClient],
};

/**
 * Define the iso languages supported. The first entry is the default.
 */
export const translateLanguages: string[] = ['en', 'es'];

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    LoggerModule.forRoot(loggerConfig),
    TranslateModule.forRoot({
      loader: translateProvider,
      defaultLanguage: translateLanguages[0],
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
