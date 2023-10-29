import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { swapiUrls } from 'src/enums/swapiUrls';
import { Character } from 'src/typeorm/entities/Character';
import { Movie } from 'src/typeorm/entities/Movie';
import { Planet } from 'src/typeorm/entities/Planet';
import { Specie } from 'src/typeorm/entities/Specie';
import { Starship } from 'src/typeorm/entities/Starship';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import { Repository } from 'typeorm';
import findEntities from './functions/findEntities';
import getApiData from './functions/getApiData';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
    @InjectRepository(Planet)
    private planetRepository: Repository<Planet>,
    @InjectRepository(Specie)
    private specieRepository: Repository<Specie>,
    @InjectRepository(Starship)
    private starshipRepository: Repository<Starship>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async getMovie(id: number): Promise<Movie> {
    return await this.movieRepository.findOne({
      where: { id },
      relations: {
        characters: true,
        planets: true,
        species: true,
        starships: true,
        vehicles: true
      }
    });
  }

  async getMovies(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  updateMovie(): string {
    return 'Update Movie';
  }

  deleteMovie(): string {
    return 'Delete Movie';
  }

  async populateDatabase(): Promise<void> {
    try {
      await this.loadCharacters();
      await this.loadPlanets();
      await this.loadSpecies();
      await this.loadStarships();
      await this.loadVehicles();
      await this.loadMovies();
    } catch (e) {
      console.log(e)
    }
  }

  async loadCharacters(): Promise<void> {
    try {
      const apiCharacters: ApiCharacter[] = await getApiData<ApiCharacter>(swapiUrls.CHARACTERS);

      const promiseArr = apiCharacters.map(apiCharacter => {
        const character: Character = this.characterRepository.create(apiCharacter);

        return this.characterRepository.save(character);
      });

      await Promise.all(promiseArr);
    } catch (e) {
      console.log(e)
    }
  }

  async loadPlanets(): Promise<void> {
    try {
      const apiPlanets: ApiPlanet[] = await getApiData<ApiPlanet>(swapiUrls.PLANETS);

      const promiseArr = apiPlanets.map(apiPlanet => {
        const planet: Planet = this.planetRepository.create(apiPlanet);

        return this.planetRepository.save(planet);
      });

      await Promise.all(promiseArr);
    } catch (e) {
      console.log(e)
    }
  }

  async loadSpecies(): Promise<void> {
    try {
      const apiSpecies: ApiSpecies[] = await getApiData<ApiSpecies>(swapiUrls.SPECIES);

      const promiseArr = apiSpecies.map(apiSpecie => {
        const specie: Specie = this.specieRepository.create(apiSpecie);

        return this.specieRepository.save(specie);
      });

      await Promise.all(promiseArr);
    } catch (e) {
      console.log(e)
    }
  }

  async loadStarships(): Promise<void> {
    try {
      const apiStarships: ApiStarships[] = await getApiData<ApiStarships>(swapiUrls.STARSHIPS);

      const promiseArr = apiStarships.map(apiStarship => {
        const starship: Starship = this.starshipRepository.create(apiStarship);

        return this.starshipRepository.save(starship);
      });

      await Promise.all(promiseArr);
    } catch (e) {
      console.log(e)
    }
  }

  async loadVehicles(): Promise<void> {
    try {
      const apiVehicles: ApiVehicle[] = await getApiData<ApiVehicle>(swapiUrls.VEHICLES);

      const promiseArr = apiVehicles.map(apiVehicle => {
        const vehicle: Vehicle = this.vehicleRepository.create(apiVehicle);

        return this.vehicleRepository.save(vehicle);
      });

      await Promise.all(promiseArr);
    } catch (e) {
      console.log(e)
    }
  }

  async loadMovies(): Promise<void> {
    try {
      const apiMovies: ApiMovie[] = await getApiData<ApiMovie>(swapiUrls.MOVIES);

      const promiseArr = apiMovies.map(async apiMovie => {
        const movie: Movie = this.movieRepository.create();

        //Gets movie related entities 
        let charactersArr: Character[] = await findEntities<Character>(this.characterRepository, apiMovie.characters);
        let planetsArr: Planet[] = await findEntities<Planet>(this.planetRepository, apiMovie.planets);
        let starshipsArr: Starship[] = await findEntities<Starship>(this.starshipRepository, apiMovie.starships);
        let vehiclesArr: Vehicle[] = await findEntities<Vehicle>(this.vehicleRepository, apiMovie.vehicles);
        let speciesArr: Specie[] = await findEntities<Specie>(this.specieRepository, apiMovie.species);

        movie.title = apiMovie.title;
        movie.episodeId = apiMovie.episode_id; 
        movie.openingCrawl = apiMovie.opening_crawl; 
        movie.director = apiMovie.director; 
        movie.producer = apiMovie.producer; 
        movie.releaseDate = apiMovie.release_date; 
        movie.characters = charactersArr;
        movie.planets = planetsArr;
        movie.starships = starshipsArr;
        movie.vehicles = vehiclesArr;
        movie.species = speciesArr;

        return this.movieRepository.save(movie);
      });

      await Promise.all(promiseArr);
    } catch (e) {
      console.log(e)
    }
  }
}
