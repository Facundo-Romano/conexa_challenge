import { Module } from '@nestjs/common';
import { MovieModule } from './modules/movie/movie.module';
import { AuthModule } from './modules/auth/auth.module';
import configModule from './config/configModule';
import databaseConfig from './typeorm/config';

@Module({
  imports: [AuthModule, MovieModule, configModule, databaseConfig],
})
export class AppModule {}
