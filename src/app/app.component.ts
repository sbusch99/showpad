import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { localStorageKeys } from './shared/local-storage-keys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly translate: TranslateService,
    private readonly logger: NGXLogger,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const { translate } = this;
    const langs: string[] = ['en', 'es'];

    translate.onDefaultLangChange.subscribe(() => this.login());
    translate.addLangs(langs);
    translate.setDefaultLang(langs[0]);
  }

  private login(): void {
    const { router } = this;

    // Each time the route changes, store the route.
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.storeLastRoute());
  }

  private storeLastRoute(): void {
    if (location.pathname !== '/') {
      localStorage.setItem(localStorageKeys.lastRoute, location.pathname);
    }
  }
}
