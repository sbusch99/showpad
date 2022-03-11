export type GenderType = 'male' | 'female' | 'genderless' | 'unknown';

export interface SpeciesDetails {
  pokemon_species: {
    name: string;
    url: string;
  };
}

export interface GenderModel {
  id: number;
  name: GenderType;
  pokemon_species_details: SpeciesDetails[];
  rate: number;
}
