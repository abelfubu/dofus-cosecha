export const enum HarvestType {
  MONSTER = 'monster',
  ARCHI = 'archi',
  BOSS = 'boss',
}

export interface Harvest {
  id: number;
  name: string;
  level: number;
  image: string;
  subzone: string;
  zone: string;
  step: number;
  type: string;
  captured?: boolean;
  amount?: number;
}
