import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('populateDatabase')
  async populateDatabase(): Promise<void> {
    return await this.movieService.populateDatabase();
  }
  
  @Get('/:id')
  get(@Param() id: number): string {
    return this.movieService.getMovie(id);
  }

  @Get()
  getAll(): string {
    return this.movieService.getMovies();
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
