import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  ngxLoggerLevel: NgxLoggerLevel.OFF,
  production: true,
  idleTimeout: 20 * 60 * 1000,
};
