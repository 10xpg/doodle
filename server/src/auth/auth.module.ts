import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashProvider } from './providers/hash.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthRepository } from './auth.repository';
import { BullmqModule } from 'src/bullmq/bullmq.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './guards/authorize.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    PrismaModule,
    BullmqModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    { provide: HashProvider, useClass: BcryptProvider },
  ],
  exports: [HashProvider],
})
export class AuthModule {}
