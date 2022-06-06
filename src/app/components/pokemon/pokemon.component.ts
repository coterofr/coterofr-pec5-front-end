import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { IPokemon } from 'src/app/interfaces/pokemon.interface';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';

interface SizeNode {
  name: string;
  children?: SizeNode[];
}

let TREE_DATA: SizeNode[] = [];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css'],
})
export class PokemonComponent implements OnInit {
  pokemon: IPokemon = new Pokemon();

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  private _transformer = (node: SizeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService
  ) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    TREE_DATA = [];
    const id: string = this.activatedRoute.snapshot.params['id'];
    this.pokemonService.getPokemonById(id).subscribe((pokemon: any) => {
      if (!pokemon) {
        return this.router.navigateByUrl('/');
      }

      this.pokemon.id = pokemon.id;
      this.pokemon.name = pokemon.name;
      this.pokemon.type = pokemon.types[0].type.name;
      this.pokemon.height = pokemon.height;
      this.pokemon.weight = pokemon.weight;
      this.pokemon.abilities = pokemon.abilities.map(
        (ability: any) => ability.ability.name
      );
      this.pokemon.move = pokemon.moves[0].move.name;
      this.pokemon.image_url = pokemon.sprites.front_default;

      let abilities: SizeNode[] = this.pokemon.abilities.map((ability: any) => {
        let sizeNode: SizeNode = {
          name: ability,
        };

        return sizeNode;
      });
      const sizeNode: SizeNode = {
        name: 'Abilities',
        children: [...abilities],
      };
      TREE_DATA.push(sizeNode);
      this.dataSource.data = TREE_DATA;

      return null;
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
