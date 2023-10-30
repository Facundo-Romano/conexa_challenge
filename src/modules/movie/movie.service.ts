import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { swapiUrls } from 'src/enums/swapiUrls';
import { Character } from 'src/typeorm/entities/Character';
import { Movie } from 'src/typeorm/entities/Movie';
import { Planet } from 'src/typeorm/entities/Planet';
import { Specie } from 'src/typeorm/entities/Specie';
import { Starship } from 'src/typeorm/entities/Starship';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import { In, Repository } from 'typeorm';
import findEntities from './functions/findEntities';
import getApiData from './functions/getApiData';
import ApiCharacter from './interfaces/swapiResponses/ApiCharacter';
import ApiPlanet from './interfaces/swapiResponses/ApiPlanet';
import ApiSpecies from './interfaces/swapiResponses/ApiSpecies';
import ApiStarships from './interfaces/swapiResponses/ApiStarship';
import ApiVehicle from './interfaces/swapiResponses/ApiVehicle';
import ApiMovie from './interfaces/swapiResponses/ApiMovie';
import DeleteMoviesRequest from './interfaces/DeleteMoviesRequest';
import { responseEstatuses } from 'src/enums/responseStatuses';
import throwError from 'src/functions/throwError';
import MovieRequest from './interfaces/MovieRequest';
import validateUpdateAndCreateRequest from './functions/validateUpdateAndCreateRequest';
import validateDeleteRequest from './functions/validateDeleteRequest';

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
    const movie: Movie = await this.movieRepository.findOne({
      where: { id },
      relations: {
        characters: true,
        planets: true,
        species: true,
        starships: true,
        vehicles: true,
      },
    });

    if (!movie) throwError(responseEstatuses.NOT_FOUND, 'Movie not found.');

    return movie;
  }

  async getMovies(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  async createMovie(request: MovieRequest): Promise<Movie> {
    validateUpdateAndCreateRequest(request);

    const movie: Movie = this.movieRepository.create();

    movie.title = request.title;
    movie.episodeId = request.episodeId;
    movie.openingCrawl = request.openingCrawl;
    movie.director = request.director;
    movie.producer = request.producer;
    movie.releaseDate = request.releaseDate;
    movie.characters = await findEntities<Character>(
      this.characterRepository,
      request.characters,
      'Character',
    );
    movie.planets = await findEntities<Planet>(
      this.planetRepository,
      request.planets,
      'Planet',
    );
    movie.species = await findEntities<Specie>(
      this.specieRepository,
      request.species,
      'Specie',
    );
    movie.starships = await findEntities<Starship>(
      this.starshipRepository,
      request.starships,
      'Starship',
    );
    movie.vehicles = await findEntities<Vehicle>(
      this.vehicleRepository,
      request.vehicles,
      'Vehicle',
    );

    return await this.movieRepository.save(movie);
  }

  async updateMovie(request: MovieRequest, id: number): Promise<Movie> {
    validateUpdateAndCreateRequest(request);

    const movie: Movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) throwError(responseEstatuses.NOT_FOUND, 'Movie not found.');

    movie.title = request.title;
    movie.episodeId = request.episodeId;
    movie.openingCrawl = request.openingCrawl;
    movie.director = request.director;
    movie.producer = request.producer;
    movie.releaseDate = request.releaseDate;
    movie.characters = await findEntities<Character>(
      this.characterRepository,
      request.characters,
      'Character',
    );
    movie.planets = await findEntities<Planet>(
      this.planetRepository,
      request.planets,
      'Planet',
    );
    movie.species = await findEntities<Specie>(
      this.specieRepository,
      request.species,
      'Specie',
    );
    movie.starships = await findEntities<Starship>(
      this.starshipRepository,
      request.starships,
      'Starship',
    );
    movie.vehicles = await findEntities<Vehicle>(
      this.vehicleRepository,
      request.vehicles,
      'Vehicle',
    );

    return await this.movieRepository.save(movie);
  }

  async deleteMovie(request: DeleteMoviesRequest): Promise<Movie[]> {
    validateDeleteRequest(request);

    const movies: Movie[] = await this.movieRepository.find({
      where: { id: In(request.ids) },
    });

    if (movies.length === 0)
      throwError(
        responseEstatuses.NOT_FOUND,
        'No movies found for the provided ids.',
      );

    await this.movieRepository.delete(movies.map((movie) => movie.id));

    return movies;
  }

  async populateDatabase(): Promise<void> {
    await this.characterRepository.delete({});
    await this.planetRepository.delete({});
    await this.specieRepository.delete({});
    await this.starshipRepository.delete({});
    await this.vehicleRepository.delete({});
    await this.movieRepository.delete({});
    await this.loadCharacters();
    await this.loadPlanets();
    await this.loadSpecies();
    await this.loadStarships();
    await this.loadVehicles();
    await this.loadMovies();
  }

  async loadCharacters(): Promise<void> {
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

  async loadPlanets(): Promise<void> {
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

  async loadSpecies(): Promise<void> {
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

  async loadStarships(): Promise<void> {
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

  async loadVehicles(): Promise<void> {
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

  async loadMovies(): Promise<void> {
    try {
      const apiMovies: ApiMovie[] = await getApiData<ApiMovie>(
        swapiUrls.MOVIES,
      );

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
      throwError(
        responseEstatuses.ERROR,
        `Error loading movies: ${err.message}`,
      );
    }
  }
}
