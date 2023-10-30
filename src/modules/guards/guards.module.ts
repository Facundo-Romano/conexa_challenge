import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserGuard } from './user.guard';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserGuard, AdminGuard],
  exports: [UserGuard, AdminGuard],
})
export class GuardsModule {}
