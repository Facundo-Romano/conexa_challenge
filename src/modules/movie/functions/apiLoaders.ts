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
import { Repository } from 'typeorm';

export async function loadCharacters(
  repository: Repository<Character>,
): Promise<void> {
  try {
    const apiCharacters: ApiCharacter[] = await getApiData<ApiCharacter>(
      swapiUrls.CHARACTERS,
    );

    const promiseArr = apiCharacters.map((apiCharacter) => {
      const character: Character = repository.create(apiCharacter);

      return repository.save(character);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading characters: ${err.message}`,
    );
  }
}

export async function loadPlanets(
  repository: Repository<Planet>,
): Promise<void> {
  try {
    const apiPlanets: ApiPlanet[] = await getApiData<ApiPlanet>(
      swapiUrls.PLANETS,
    );

    const promiseArr = apiPlanets.map((apiPlanet) => {
      const planet: Planet = repository.create(apiPlanet);

      return repository.save(planet);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading planets: ${err.message}`,
    );
  }
}

export async function loadSpecies(
  repository: Repository<Specie>,
): Promise<void> {
  try {
    const apiSpecies: ApiSpecies[] = await getApiData<ApiSpecies>(
      swapiUrls.SPECIES,
    );

    const promiseArr = apiSpecies.map((apiSpecie) => {
      const specie: Specie = repository.create(apiSpecie);

      return repository.save(specie);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading Species: ${err.message}`,
    );
  }
}

export async function loadStarships(
  repository: Repository<Starship>,
): Promise<void> {
  try {
    const apiStarships: ApiStarships[] = await getApiData<ApiStarships>(
      swapiUrls.STARSHIPS,
    );

    const promiseArr = apiStarships.map((apiStarship) => {
      const starship: Starship = repository.create(apiStarship);

      return repository.save(starship);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading starships: ${err.message}`,
    );
  }
}

export async function loadVehicles(
  repository: Repository<Starship>,
): Promise<void> {
  try {
    const apiVehicles: ApiVehicle[] = await getApiData<ApiVehicle>(
      swapiUrls.VEHICLES,
    );

    const promiseArr = apiVehicles.map((apiVehicle) => {
      const vehicle: Vehicle = repository.create(apiVehicle);

      return repository.save(vehicle);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(
      responseEstatuses.ERROR,
      `Error loading vehicles: ${err.message}`,
    );
  }
}

export async function loadMovies(
  repository: Repository<Movie>,
  characterRepository: Repository<Character>,
  planetRepository: Repository<Planet>,
  specieRepository: Repository<Specie>,
  starshipRepository: Repository<Starship>,
  vehicleRepository: Repository<Vehicle>,
): Promise<void> {
  try {
    const apiMovies: ApiMovie[] = await getApiData<ApiMovie>(swapiUrls.MOVIES);

    const promiseArr = apiMovies.map(async (apiMovie) => {
      const movie: Movie = repository.create();

      //Gets movie related entities
      const charactersArr: Character[] = await findEntities<Character>(
        characterRepository,
        apiMovie.characters,
        'Character',
      );
      const planetsArr: Planet[] = await findEntities<Planet>(
        planetRepository,
        apiMovie.planets,
        'Planet',
      );
      const starshipsArr: Starship[] = await findEntities<Starship>(
        starshipRepository,
        apiMovie.starships,
        'Starship',
      );
      const vehiclesArr: Vehicle[] = await findEntities<Vehicle>(
        vehicleRepository,
        apiMovie.vehicles,
        'Vehicle',
      );
      const speciesArr: Specie[] = await findEntities<Specie>(
        specieRepository,
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

      return repository.save(movie);
    });

    await Promise.all(promiseArr);
  } catch (err) {
    throwError(responseEstatuses.ERROR, `Error loading movies: ${err.message}`);
  }
}
