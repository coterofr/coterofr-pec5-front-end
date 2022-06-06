import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cardsAnimation } from 'src/app/animations/pokemon.animation';
import { IPokemon } from 'src/app/interfaces/pokemon.interface';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css'],
  animations: [cardsAnimation],
})
export class PokemonsComponent implements OnInit {
  pokemons: IPokemon[] = [];
  loading: boolean = false;

  constructor(private router: Router, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe((pokemons: any) => {
      this.loading = true;

      if (pokemons) {
        pokemons.results.forEach((pokemonDetailList: any) => {
          if (pokemonDetailList) {
            this.pokemonService
              .getPokemonByName(pokemonDetailList.name)
              .subscribe((pokemonDetail: any) => {
                let pokemon: IPokemon = new Pokemon();
                pokemon.id = pokemonDetail.id;
                pokemon.name = pokemonDetail.name;
                pokemon.type = pokemonDetail.types[0].type.name;
                pokemon.height = pokemonDetail.height;
                pokemon.weight = pokemonDetail.weight;
                pokemon.abilities = pokemonDetail.abilities.map(
                  (ability: any) => ability.ability.name
                );
                pokemon.move = pokemonDetail.moves[0].move.name;
                pokemon.image_url = pokemonDetail.sprites.front_default;

                this.pokemons.push(pokemon);
              });
          }
        });

        setTimeout(() => {
          this.loading = false;
        }, 500);
      } else {
        this.loading = false;
      }
    });
  }

  viewPokemon(id: string): void {
    this.router.navigate(['/pokemons', id]);
  }
}
