import { Body, Controller, Delete, Get, Param, Put, Res } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from 'src/typeorm/entities/Movie';
import { Response } from 'express';
import DeleteMoviesRequest from './interfaces/DeleteMoviesRequest';
import handleErrorResponse from 'src/functions/handleErrorResponse';
import handleResponse from 'src/functions/handleResponse';
import UpdateMovieRequest from './interfaces/UpdateMovieRequest';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('populateDatabase')
  async populateDatabase(@Res() res: Response): Promise<Response> {
    try {
      await this.movieService.populateDatabase();

      return handleResponse([], 'Data loaded successfully.', res);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }

  @Get('/:id')
  async get(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    try {
      const movie: Movie = await this.movieService.getMovie(id);

      return handleResponse<Movie>([movie], 'Movie found successfully.', res);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    try {
      const movies: Movie[] = await this.movieService.getMovies();

      return handleResponse<Movie>(movies, 'Movies found successfully.', res);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateMovieRequest,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedMovie: Movie = await this.movieService.updateMovie(body, id);

      return handleResponse<Movie>(
        [updatedMovie],
        'Movie updated successfully.',
        res,
      );
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }

  @Delete()
  async delete(
    @Body() body: DeleteMoviesRequest,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const deletedMovies: Movie[] = await this.movieService.deleteMovie(body);

      return handleResponse<Movie>(
        deletedMovies,
        'Movies deleted successfully.',
        res,
      );
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }
}
