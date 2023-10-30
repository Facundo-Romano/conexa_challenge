import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from 'src/typeorm/entities/Character';
import { Movie } from 'src/typeorm/entities/Movie';
import { Planet } from 'src/typeorm/entities/Planet';
import { Specie } from 'src/typeorm/entities/Specie';
import { Starship } from 'src/typeorm/entities/Starship';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import { In, Repository } from 'typeorm';
import findEntities from './functions/findEntities';
import DeleteMoviesRequest from './interfaces/DeleteMoviesRequest';
import { responseEstatuses } from 'src/utils/enums/responseStatuses';
import MovieRequest from './interfaces/MovieRequest';
import validateUpdateAndCreateRequest from './functions/validateUpdateAndCreateRequest';
import validateDeleteRequest from './functions/validateDeleteRequest';
import throwError from 'src/utils/functions/throwError';
import { loadCharacters, loadMovies, loadPlanets, loadSpecies, loadStarships, loadVehicles } from './functions/apiLoaders';

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

  async deleteMovies(request: DeleteMoviesRequest): Promise<Movie[]> {
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
    await loadCharacters();
    await loadPlanets();
    await loadSpecies();
    await loadStarships();
    await loadVehicles();
    await loadMovies();
  }
}
