import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { KeyValueMenuItem } from '../shared/menu-item';
import { MainType } from './main.component.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  action: MainType | '' = '';

  readonly items: KeyValueMenuItem<MainType>[] = [
    { key: 'game', value: { label: 'Game', iconFA: 'far fa-tennis-ball' } },
    { key: 'drill', value: { label: 'Drill', iconFA: 'fal fa-racquet' } },
    { key: 'workout', value: { label: 'Workout', iconFA: 'fal fa-running' } },
  ];
  readonly onOff = new FormControl(false);

  status = 'status stuff';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const { route, router } = this;

    this.action =
      (route.firstChild?.snapshot.routeConfig?.path as MainType) || '';

    if (!this.action) {
      this.action = this.items[0].key;
      router.navigate([this.action], { relativeTo: route });
    }
  }
}
