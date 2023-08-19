import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenService } from 'auth/services/auth.token.service';
import { ConfigService } from 'config';
import { HashService } from 'shared/services';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthTokenService, HashService, UserService, ConfigService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
