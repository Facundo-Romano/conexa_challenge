import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/typeorm/entities/Movie';
import { Character } from 'src/typeorm/entities/Character';
import { Planet } from 'src/typeorm/entities/Planet';
import { Specie } from 'src/typeorm/entities/Specie';
import { Starship } from 'src/typeorm/entities/Starship';
import { Vehicle } from 'src/typeorm/entities/Vehicle';
import { GuardsModule } from '../guards/guards.module';
import { User } from 'src/typeorm/entities/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Movie,
      Character,
      Planet,
      Specie,
      Starship,
      Vehicle,
    ]),
    GuardsModule
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
