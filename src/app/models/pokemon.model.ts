import { IPokemon } from '../interfaces/pokemon.interface';

export class Pokemon implements IPokemon {
  id!: string;
  name!: string;
  type!: string;
  height!: string;
  weight!: string;
  abilities!: string[];
  move!: number;
  image_url!: string;

  constructor() {}
}
