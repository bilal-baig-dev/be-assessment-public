import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthenticatedUserPayload } from '../types/auth-type';
import { ConfigService } from 'config';
import { UserService } from 'user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJWTSecretKey(),
    });
  }

  async validate(req: Request, payload: IAuthenticatedUserPayload) {
    const user = await this.userService.findByIdWithRelations(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (payload.id) {
      const { password, ...userWithoutPwd } = user;
      return {
        ...userWithoutPwd,
      };
    }

    return false;
  }
}
