import MovieRequest from 'src/modules/movie/interfaces/MovieRequest';
import { MovieController } from 'src/modules/movie/movie.controller';
import { MovieService } from 'src/modules/movie/movie.service';
import { Character } from 'src/typeorm/entities/Character';
import { Movie } from 'src/typeorm/entities/Movie';
import { Planet } from 'src/typeorm/entities/Planet';
import { Specie } from 'src/typeorm/entities/Specie';
import { Starship } from 'src/typeorm/entities/Starship';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import { EntityManager, Repository } from 'typeorm';

describe('MovieController', () => {
  let movieController: MovieController;
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
  let response: any;

  beforeEach(() => {
    movieRepository = new Repository<Movie>(Movie, entityManager);
    movieService = new MovieService(
      movieRepository,
      planetRepository,
      specieRepository,
      starshipRepository,
      vehicleRepository,
      characterRepository,
    );
    movieController = new MovieController(movieService);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('populate database', () => {
    it('should load swapi data in the db', async () => {
      jest.spyOn(movieService, 'populateDatabase').mockImplementation();

      await movieController.populateDatabase(response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Data loaded successfully.',
        results: [],
      });
    });
  });

  describe('get', () => {
    it('should return a movie', async () => {
      jest
        .spyOn(movieService, 'getMovie')
        .mockImplementation(async () => movie);

      await movieController.get(1, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Movie found successfully.',
        results: [movie],
      });
    });
  });

  describe('getAll', () => {
    it('should return all movies', async () => {
      jest
        .spyOn(movieService, 'getMovies')
        .mockImplementation(async () => [movie]);

      await movieController.getAll(response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Movies found successfully.',
        results: [movie],
      });
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      jest
        .spyOn(movieService, 'createMovie')
        .mockImplementation(async () => movie);

      const movieRequest: MovieRequest = {
        ...movie,
        characters: ['character'],
        planets: ['planet'],
        species: ['specie'],
        starships: ['starship'],
        vehicles: ['vehicle'],
      };

      await movieController.create(movieRequest, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Movie created successfully.',
        results: [movie],
      });
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      jest
        .spyOn(movieService, 'updateMovie')
        .mockImplementation(async () => movie);

      const movieRequest: MovieRequest = {
        ...movie,
        characters: ['character'],
        planets: ['planet'],
        species: ['specie'],
        starships: ['starship'],
        vehicles: ['vehicle'],
      };

      await movieController.update(1, movieRequest, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Movie updated successfully.',
        results: [movie],
      });
    });
  });

  describe('delete', () => {
    it('should delete movies', async () => {
      jest
        .spyOn(movieService, 'deleteMovies')
        .mockImplementation(async () => [movie]);

      await movieController.delete({ ids: [1] }, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Movies deleted successfully.',
        results: [movie],
      });
    });
  });
});
