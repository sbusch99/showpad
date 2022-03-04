import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeyValueMenuItem } from '../../shared/menu-item';
import { GenderType } from '../../models/gender.model';
import { FormControl } from '@angular/forms';
import { BaseSubscriptions } from '../../shared/base-subscriptions/base-subscriptions';
import { takeUntil } from 'rxjs/operators';
import { MainFacetModel } from './main-facet-model';
import { PokemonService } from '../../services/pokemon/pokemon.service';

@Component({
  selector: 'app-main-facet',
  templateUrl: './main-facet.component.html',
  styleUrls: ['./main-facet.component.scss'],
})
export class MainFacetComponent extends BaseSubscriptions implements OnInit {
  @Output() filter = new EventEmitter<MainFacetModel>();

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
  readonly name = new FormControl('');

  constructor(private readonly pokemonService: PokemonService) {
    super();
  }

  ngOnInit(): void {
    const { genders, destroy$, name, pokemonService } = this;

    for (const gender of genders) {
      const { value } = gender;

      if (value.formControl) {
        value.formControl.valueChanges
          .pipe(takeUntil(destroy$))
          .subscribe((v) => this.emit());
      }

      value.count = pokemonService.rows.filter(
        (r) => r.gender === gender.key,
      ).length;
    }

    name.valueChanges.pipe(takeUntil(destroy$)).subscribe(() => this.emit());
  }

  private emit(): void {
    const { filter } = this;
    const name = (this.name.value as string).toLowerCase();
    const genders = this.genders
      .filter((g) => g.value.formControl?.value)
      .map((g) => g.key);

    const model: MainFacetModel = {
      genders,
      name,
    };

    filter.emit(model);
  }
}
