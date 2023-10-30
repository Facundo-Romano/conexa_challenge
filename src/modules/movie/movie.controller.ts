import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from 'src/typeorm/entities/Movie';
import { Response } from 'express';
import DeleteMoviesRequest from './interfaces/DeleteMoviesRequest';
import handleResponse from 'src/utils/functions/handleResponse';
import MovieRequest from './interfaces/MovieRequest';
import { AdminGuard } from '../guards/admin.guard';
import { UserGuard } from '../guards/user.guard';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('populateDatabase')
  @UseGuards(AdminGuard)
  async populateDatabase(@Res() res: Response): Promise<Response> {
    await this.movieService.populateDatabase();

    return handleResponse([], 'Data loaded successfully.', res);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async get(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const movie: Movie = await this.movieService.getMovie(id);

    return handleResponse<Movie>([movie], 'Movie found successfully.', res);
  }

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    const movies: Movie[] = await this.movieService.getMovies();

    return handleResponse<Movie>(movies, 'Movies found successfully.', res);
  }

  @Post('create')
  @UseGuards(AdminGuard)
  async create(
    @Body() body: MovieRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const movie: Movie = await this.movieService.createMovie(body);

    return handleResponse<Movie>(
      [movie],
      'Movie created successfully.',
      res,
    );
  }

  @Put('/:id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: number,
    @Body() body: MovieRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const updatedMovie: Movie = await this.movieService.updateMovie(body, id);

    return handleResponse<Movie>(
      [updatedMovie],
      'Movie updated successfully.',
      res,
    );
  }

  @Delete()
  @UseGuards(AdminGuard)
  async delete(
    @Body() body: DeleteMoviesRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const deletedMovies: Movie[] = await this.movieService.deleteMovie(body);

    return handleResponse<Movie>(
      deletedMovies,
      'Movies deleted successfully.',
      res,
    );
  }
}
