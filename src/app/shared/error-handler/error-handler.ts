import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

/**
 * The global error handler should catch all non try-catch errors.
 * Exclude HttpErrorResponse and change detect errors.
 */
@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(
    private readonly logger: NGXLogger,
    private readonly ngZone: NgZone,
  ) {
    super();
  }

  override handleError(error: Error): void {
    const { logger, ngZone } = this;
    const { message } = error;

    logger.error(`uncaught exception - ${message}`, error);

    // To avoid infinite logging on every change detection cycle, throw a new exception
    if (!ngZone.isStable) {
      throw error;
    }
  }
}
