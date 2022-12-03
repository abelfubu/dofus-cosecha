export const enum HarvestType {
  MONSTER,
  BOSS,
  ARCHI,
}

export interface Harvest {
  id: string;
  name: string;
  level: number;
  image: string;
  subzone: string;
  zone: string;
  step: number;
  type: HarvestType;
  captured?: boolean;
  amount?: number;
}
