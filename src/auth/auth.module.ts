import { PassportModule } from '@nestjs/passport';
import { SharedModule } from 'shared';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from 'config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenService } from './services/auth.token.service';
import { UserService } from 'user/services/user.service';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getJWTSecretKey(),
        signOptions: {
          expiresIn: configService.getJWTTokenExpiration(),
        },
      }),
    }),
    SharedModule,
    UserModule,
  ],
  providers: [JwtStrategy, AuthTokenService],
  exports: [AuthTokenService],
  controllers: [],
})
export class AuthModule {}
