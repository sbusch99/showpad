import { GenderType } from '../../models/gender.model';

export interface MainFacetModel {
  name: string;
  genders: GenderType[];
  catches: boolean;
  wishes: boolean;
}
