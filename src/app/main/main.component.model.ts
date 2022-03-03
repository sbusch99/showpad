export type MainType = 'game' | 'drill' | 'workout';
export type GamePeople = 'single' | 'double';
export type GameType = 'standard' | 'tieBreaker';

export interface GameParams {
  people?: GamePeople;
  type?: GameType;
}
