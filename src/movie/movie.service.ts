import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
  getMovie(id: number): string {
    return 'Movie: ' + id;
  }
  getMovies(): string {
    return 'All Movies';
  }
  updateMovie(): string {
    return 'Update Movie';
  }
  deleteMovie(): string {
    return 'Delete Movie';
  }
}
