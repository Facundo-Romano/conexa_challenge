import * as findEntities from 'src/modules/movie/functions/findEntities';
import * as validateDeleteRequest from 'src/modules/movie/functions/validateDeleteRequest';
import * as validateUpdateAndCreateRequest from 'src/modules/movie/functions/validateUpdateAndCreateRequest';
import * as apiLoaders from 'src/modules/movie/functions/apiLoaders';
import DeleteMoviesRequest from 'src/modules/movie/interfaces/DeleteMoviesRequest';
import MovieRequest from 'src/modules/movie/interfaces/MovieRequest';
import { MovieService } from 'src/modules/movie/movie.service';
import { Character } from 'src/typeorm/entities/Character';
import { Movie } from 'src/typeorm/entities/Movie';
import { Planet } from 'src/typeorm/entities/Planet';
import { Specie } from 'src/typeorm/entities/Specie';
import { Starship } from 'src/typeorm/entities/Starship';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import throwError from 'src/utils/functions/throwError';
import { EntityManager, Repository } from 'typeorm';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;
  let planetRepository: Repository<Planet>;
  let specieRepository: Repository<Specie>;
  let starshipRepository: Repository<Starship>;
  let vehicleRepository: Repository<Vehicle>;
  let characterRepository: Repository<Character>;
  let entityManager: EntityManager;
  let movie: Movie;
  let planet: Planet;
  let specie: Specie;
  let starship: Starship;
  let vehicle: Vehicle;
  let character: Character;

  beforeEach(() => {
    movieRepository = new Repository<Movie>(Movie, entityManager);
    planetRepository = new Repository<Planet>(Planet, entityManager);
    specieRepository = new Repository<Specie>(Specie, entityManager);
    starshipRepository = new Repository<Starship>(Starship, entityManager);
    vehicleRepository = new Repository<Vehicle>(Vehicle, entityManager);
    characterRepository = new Repository<Character>(Character, entityManager);
    movieService = new MovieService(
      movieRepository,
      planetRepository,
      specieRepository,
      starshipRepository,
      vehicleRepository,
      characterRepository,
    );

    character = new Character();
    character.id = 1;
    character.url = 'url';

    planet = new Planet();
    planet.id = 1;
    planet.url = 'url';

    specie = new Specie();
    specie.id = 1;
    specie.url = 'url';

    starship = new Starship();
    starship.id = 1;
    starship.url = 'url';

    vehicle = new Vehicle();
    vehicle.id = 1;
    vehicle.url = 'url';

    movie = new Movie();
    movie.id = 1;
    movie.title = 'title';
    movie.episodeId = 1;
    movie.openingCrawl = 'openingCrawl';
    movie.director = 'director';
    movie.producer = 'producer';
    movie.releaseDate = 'releaseDate';
    movie.characters = [character];
    movie.planets = [planet];
    movie.species = [specie];
    movie.starships = [starship];
    movie.vehicles = [vehicle];
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getMovie', () => {
    it('should return a movie', async () => {
      jest
        .spyOn(movieRepository, 'findOne')
        .mockImplementation(async () => movie);

      const result: Movie = await movieService.getMovie(1);

      expect(result).toEqual(movie);
    });
  });

  describe('getMovie error - movie not found', () => {
    it('should return an HttpExeption', async () => {
      try {
        jest
          .spyOn(movieRepository, 'findOne')
          .mockImplementation(async () => null);
        await movieService.getMovie(1);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.NOT_FOUND);
        expect(err.message).toEqual('Movie not found.');
      }
    });
  });

  describe('getMovies', () => {
    it('should return all movies', async () => {
      jest
        .spyOn(movieRepository, 'find')
        .mockImplementation(async () => [movie]);

      const results: Movie[] = await movieService.getMovies();

      expect(results).toEqual([movie]);
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      jest
        .spyOn(validateUpdateAndCreateRequest, 'default')
        .mockImplementation();
      jest.spyOn(movieRepository, 'create').mockImplementation(() => movie);
      jest.spyOn(findEntities, 'default').mockImplementation();
      jest.spyOn(movieRepository, 'save').mockImplementation(async () => movie);

      const movieRequest: MovieRequest = {
        ...movie,
        characters: ['character'],
        planets: ['planet'],
        species: ['specie'],
        starships: ['starship'],
        vehicles: ['vehicle'],
      };

      const result: Movie = await movieService.createMovie(movieRequest);

      expect(result).toEqual(movie);
    });
  });

  describe('createMovie error - invalid request', () => {
    it('should return an HttpExeption', async () => {
      try {
        const invalidRequest: MovieRequest = {
          ...movie,
          title: '',
          characters: ['character'],
          planets: ['planet'],
          species: ['specie'],
          starships: ['starship'],
          vehicles: ['vehicle'],
        };

        await movieService.createMovie(invalidRequest);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual(
          'Invalid title format. title cannot be null.',
        );
      }
    });
  });

  describe('createMovie error - related entities not found', () => {
    it('should return an HttpExeption', async () => {
      try {
        jest
          .spyOn(validateUpdateAndCreateRequest, 'default')
          .mockImplementation();
        jest.spyOn(movieRepository, 'create').mockImplementation(() => movie);
        jest.spyOn(findEntities, 'default').mockImplementation(async () => {
          throwError(responseEstatuses.NOT_FOUND, 'Character not found');
          return [];
        });

        const movieRequest: MovieRequest = {
          ...movie,
          characters: ['character'],
          planets: ['planet'],
          species: ['specie'],
          starships: ['starship'],
          vehicles: ['vehicle'],
        };

        await movieService.createMovie(movieRequest);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.NOT_FOUND);
        expect(err.message).toEqual('Character not found');
      }
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      jest
        .spyOn(validateUpdateAndCreateRequest, 'default')
        .mockImplementation();
      jest
        .spyOn(movieRepository, 'findOne')
        .mockImplementation(async () => movie);
      jest.spyOn(findEntities, 'default').mockImplementation();
      jest.spyOn(movieRepository, 'save').mockImplementation(async () => movie);

      const movieRequest: MovieRequest = {
        ...movie,
        characters: ['character'],
        planets: ['planet'],
        species: ['specie'],
        starships: ['starship'],
        vehicles: ['vehicle'],
      };

      const result: Movie = await movieService.updateMovie(movieRequest, 1);

      expect(result).toEqual(movie);
    });
  });

  describe('updateMovie error - invalid request', () => {
    it('should return an HttpExeption', async () => {
      try {
        const invalidRequest: MovieRequest = {
          ...movie,
          title: '',
          characters: ['character'],
          planets: ['planet'],
          species: ['specie'],
          starships: ['starship'],
          vehicles: ['vehicle'],
        };

        await movieService.updateMovie(invalidRequest, 1);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual(
          'Invalid title format. title cannot be null.',
        );
      }
    });
  });

  describe('updateMovie error - movie not found', () => {
    it('should return an HttpExeption', async () => {
      try {
        jest
          .spyOn(validateUpdateAndCreateRequest, 'default')
          .mockImplementation();
        jest
          .spyOn(movieRepository, 'findOne')
          .mockImplementation(async () => null);

        const invalidRequest: MovieRequest = {
          ...movie,
          characters: ['character'],
          planets: ['planet'],
          species: ['specie'],
          starships: ['starship'],
          vehicles: ['vehicle'],
        };

        await movieService.updateMovie(invalidRequest, 1);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.NOT_FOUND);
        expect(err.message).toEqual('Movie not found.');
      }
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      jest.spyOn(validateDeleteRequest, 'default').mockImplementation();
      jest
        .spyOn(movieRepository, 'find')
        .mockImplementation(async () => [movie]);
      jest.spyOn(movieRepository, 'delete').mockImplementation();

      const results: Movie[] = await movieService.deleteMovies({ ids: [1] });

      expect(results).toEqual([movie]);
    });
  });

  describe('deleteMovie error - invalid request', () => {
    it('should return an HttpExeption', async () => {
      try {
        const request: DeleteMoviesRequest = {
          ids: [],
        };

        delete request.ids;

        await movieService.deleteMovies(request);
      } catch (err) {
        expect(err.status).toEqual(responseEstatuses.BAD_REQUEST);
        expect(err.message).toEqual('Ids are required.');
      }
    });
  });

  describe('deleteMovie error - movie not found', () => {
    it('should return an HttpExeption', async () => {
      try {
        jest.spyOn(validateDeleteRequest, 'default').mockImplementation();
        jest.spyOn(movieRepository, 'find').mockImplementation(async () => []);

        await movieService.deleteMovies({ ids: [1] });
      } catch (err) {
        expect(err.message).toEqual('No movies found for the provided ids.');
      }
    });
  });

  describe('populateDatabase', () => {
    it('should delete previous records and load new ones into the database', async () => {
      try {
        jest.spyOn(planetRepository, 'delete').mockImplementation();
        jest.spyOn(specieRepository, 'delete').mockImplementation();
        jest.spyOn(starshipRepository, 'delete').mockImplementation();
        jest.spyOn(vehicleRepository, 'delete').mockImplementation();
        jest.spyOn(characterRepository, 'delete').mockImplementation();
        jest.spyOn(movieRepository, 'delete').mockImplementation();
        jest.spyOn(apiLoaders, 'loadCharacters').mockImplementation();
        jest.spyOn(apiLoaders, 'loadPlanets').mockImplementation();
        jest.spyOn(apiLoaders, 'loadSpecies').mockImplementation();
        jest.spyOn(apiLoaders, 'loadStarships').mockImplementation();
        jest.spyOn(apiLoaders, 'loadVehicles').mockImplementation();
        jest.spyOn(apiLoaders, 'loadMovies').mockImplementation();

        await movieService.populateDatabase();

        expect(true).toEqual(true);
      } catch (err) {
        throw new Error(`Expected no exception, but got: ${err}`);
      }
    });
  });
});
