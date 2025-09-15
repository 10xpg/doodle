import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './users.repository';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), PaginationModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
