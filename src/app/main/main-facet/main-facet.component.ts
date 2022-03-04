import { Component, OnInit } from '@angular/core';
import { KeyValueMenuItem } from '../../shared/menu-item';
import { GenderType } from '../../models/gender.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main-facet',
  templateUrl: './main-facet.component.html',
  styleUrls: ['./main-facet.component.scss'],
})
export class MainFacetComponent implements OnInit {
  readonly genders: KeyValueMenuItem<GenderType>[] = [
    {
      key: 'female',
      value: {
        label: 'app.models.gender.type.female',
        formControl: new FormControl(),
      },
    },
    {
      key: 'male',
      value: {
        label: 'app.models.gender.type.male',
        formControl: new FormControl(),
      },
    },
    {
      key: 'genderless',
      value: {
        label: 'app.models.gender.type.genderless',
        formControl: new FormControl(),
      },
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
