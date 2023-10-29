import { Controller, Delete, Get, Param, Patch, Res } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from 'src/typeorm/entities/Movie';
import { responseEstatuses } from 'src/enums/responseStatuses';
import { Response } from 'express';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('populateDatabase')
  async populateDatabase(@Res() res: Response): Promise<Response> {
    await this.movieService.populateDatabase();

    return res.status(responseEstatuses.SUCESS).json({ message: 'Data loaded successfully', results: [] });
  }
  
  @Get('/:id')
  async get(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const movie: Movie =  await this.movieService.getMovie(id);

    return res.status(responseEstatuses.SUCESS).json({ message: 'Movie found successfully', results: [movie] });
  }

  @Get()
  async getAll(@Res() res: Response): Promise<Response> {
    const movies: Movie[] = await this.movieService.getMovies();

    return res.status(responseEstatuses.SUCESS).json({ message: 'Movies found successfully', results: movies });
  }

  @Patch()
  update(): string {
    return this.movieService.updateMovie();
  }

  @Delete()
  delete(): string {
    return this.movieService.deleteMovie();
  }
}
