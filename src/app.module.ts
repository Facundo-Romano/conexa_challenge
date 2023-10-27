import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import configModule from './config/configModule';
import databaseConfig from './typeorm/config';

@Module({
  imports: [AuthModule, MovieModule, configModule, databaseConfig]
})
export class AppModule {}
