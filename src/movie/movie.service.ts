import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
  getMovies(): string {
    return 'Movies';
  }
}
