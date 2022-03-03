import { GenderType } from './gender.model';

export interface PokemonModel {
  id: string;
  gender: GenderType;
  name: string;
  url: string;
}
