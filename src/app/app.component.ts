import { Component } from '@angular/core';
import { delay, EMPTY, startWith, concat, merge, tap, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    // helper method
    const delayedMessage = (message: string, delayedTime: number) =>
      EMPTY.pipe(
        startWith(message),
        map((v) => v + ' ' + delayedTime),
        delay(delayedTime),
      );

    const mergeMessage = 'Merge message ';
    merge(
      delayedMessage(mergeMessage + 1, 1000),
      delayedMessage(mergeMessage + 2, 3000),
      delayedMessage(mergeMessage + 3, 2000),
      delayedMessage(mergeMessage + 4, 1000),
      delayedMessage(mergeMessage + 5, 4000),
    ).subscribe((message: any) => console.log(message));
  }
}
