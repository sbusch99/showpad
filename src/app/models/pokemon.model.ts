import { GenderType } from './gender.model';

export interface PokemonModel {
  catch: boolean;
  gender: GenderType;
  id: string;
  name: string;
  url: string;
  wish: boolean;
}

export interface CatchWishModel {
  catches: string[];
  wishes: string[];
}
