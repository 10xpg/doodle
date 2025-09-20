import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './users.repository';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from 'src/auth/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    PaginationModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
