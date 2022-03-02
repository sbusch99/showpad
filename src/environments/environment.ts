import { NgxLoggerLevel } from 'ngx-logger';
import 'zone.js/dist/zone-error';

export const environment = {
  ngxLoggerLevel: NgxLoggerLevel.DEBUG,
  production: false,
  idleTimeout: 20 * 60 * 1000,
};
