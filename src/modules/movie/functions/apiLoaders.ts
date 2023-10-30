import { swapiUrls } from 'src/utils/enums/swapiUrls';
import ApiCharacter from '../interfaces/swapiResponses/ApiCharacter';
import getApiData from './getApiData';
import { Character } from 'src/typeorm/entities/Character';
import throwError from 'src/utils/functions/throwError';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import ApiPlanet from '../interfaces/swapiResponses/ApiPlanet';
import { Planet } from 'src/typeorm/entities/Planet';
import ApiSpecies from '../interfaces/swapiResponses/ApiSpecies';
import { Specie } from 'src/typeorm/entities/Specie';
import ApiStarships from '../interfaces/swapiResponses/ApiStarship';
import { Starship } from 'src/typeorm/entities/Starship';
import ApiVehicle from '../interfaces/swapiResponses/ApiVehicle';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import ApiMovie from '../interfaces/swapiResponses/ApiMovie';
import { Movie } from 'src/typeorm/entities/Movie';
import findEntities from './findEntities';

export async function loadCharacters(): Promise<void> {
  try {
    const apiCharacters: ApiCharacter[] = await getApiData<ApiCharacter>(
      swapiUrls.CHARACTERS,
    );

    const promiseArr = apiCharacters.map((apiCharacter) => {
      const character: Character =
        this.characterRepository.create(apiCharacter);

      return this.characterRepository.save(character);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading characters: ${err.message}`,
    );
  }
}

export async function loadPlanets(): Promise<void> {
  try {
    const apiPlanets: ApiPlanet[] = await getApiData<ApiPlanet>(
      swapiUrls.PLANETS,
    );

    const promiseArr = apiPlanets.map((apiPlanet) => {
      const planet: Planet = this.planetRepository.create(apiPlanet);

      return this.planetRepository.save(planet);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading planets: ${err.message}`,
    );
  }
}

export async function loadSpecies(): Promise<void> {
  try {
    const apiSpecies: ApiSpecies[] = await getApiData<ApiSpecies>(
      swapiUrls.SPECIES,
    );

    const promiseArr = apiSpecies.map((apiSpecie) => {
      const specie: Specie = this.specieRepository.create(apiSpecie);

      return this.specieRepository.save(specie);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading Species: ${err.message}`,
    );
  }
}

export async function loadStarships(): Promise<void> {
  try {
    const apiStarships: ApiStarships[] = await getApiData<ApiStarships>(
      swapiUrls.STARSHIPS,
    );

    const promiseArr = apiStarships.map((apiStarship) => {
      const starship: Starship = this.starshipRepository.create(apiStarship);

      return this.starshipRepository.save(starship);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading starships: ${err.message}`,
    );
  }
}

export async function loadVehicles(): Promise<void> {
  try {
    const apiVehicles: ApiVehicle[] = await getApiData<ApiVehicle>(
      swapiUrls.VEHICLES,
    );

    const promiseArr = apiVehicles.map((apiVehicle) => {
      const vehicle: Vehicle = this.vehicleRepository.create(apiVehicle);

      return this.vehicleRepository.save(vehicle);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading vehicles: ${err.message}`,
    );
  }
}

export async function loadMovies(): Promise<void> {
  try {
    const apiMovies: ApiMovie[] = await getApiData<ApiMovie>(swapiUrls.MOVIES);

    const promiseArr = apiMovies.map(async (apiMovie) => {
      const movie: Movie = this.movieRepository.create();

      //Gets movie related entities
      const charactersArr: Character[] = await findEntities<Character>(
        this.characterRepository,
        apiMovie.characters,
        'Character',
      );
      const planetsArr: Planet[] = await findEntities<Planet>(
        this.planetRepository,
        apiMovie.planets,
        'Planet',
      );
      const starshipsArr: Starship[] = await findEntities<Starship>(
        this.starshipRepository,
        apiMovie.starships,
        'Starship',
      );
      const vehiclesArr: Vehicle[] = await findEntities<Vehicle>(
        this.vehicleRepository,
        apiMovie.vehicles,
        'Vehicle',
      );
      const speciesArr: Specie[] = await findEntities<Specie>(
        this.specieRepository,
        apiMovie.species,
        'Specie',
      );

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
  } catch (err) {
    throwError(responseEstatuses.ERROR, `Error loading movies: ${err.message}`);
  }
}
