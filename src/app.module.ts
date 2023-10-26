import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
