import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, MovieModule]
})
export class AppModule {}
