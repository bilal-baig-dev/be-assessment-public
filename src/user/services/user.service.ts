import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { HashService } from 'shared/services';
import { UserRegisterLoginDto } from 'user/dto/register-user.dto';
import { IAuthenticatedUserPayload } from 'auth/types/auth-type';
import { AuthTokenService } from 'auth/services/auth.token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  //helper functions
  async find(where, select = []) {
    return await this.userRepository.findOne({ where, select });
  }

  async findByIdWithRelations(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  //user register
  async register(body: UserRegisterLoginDto) {
    try {
      let user: User = new User();
      const { password, ...rest } = body;

      // check if email is already exists
      const isEmailAlreadyInUse = await this.find({ email: body.email });
      if (isEmailAlreadyInUse) {
        throw new BadRequestException(
          'User with the given email already exists',
        );
      }

      // Set other properties of the user and encrypt password
      user = {
        ...user,
        ...rest,
        password: await this.hashService.hashPassword(password),
      };

      // Save the user and return it
      const createdUser = await this.userRepository.save(user);

      // Return access token and required detials of the currently loggedin user
      const { password: mypassword, ...data } = createdUser;

      const responseBody = {
        user: {
          ...data,
        },
      };
      return responseBody;
    } catch (err) {
      throw err;
    }
  }

  //user login
  async login(body: UserRegisterLoginDto) {
    try {
      const { email } = body;
      const where = {
        email,
      };
      // Find user by email
      const eitherUserOrNull = await this.find(where);
      if (!eitherUserOrNull) {
        throw new NotFoundException('User with given email not found');
      }

      const jwtPayload: IAuthenticatedUserPayload = {
        id: eitherUserOrNull.id,
      };

      // Generate access token
      const accessToken = this.authTokenService.sign(jwtPayload);
      return {
        jwt: accessToken,
      };
    } catch (err) {
      console.log('Error while login', err);
      throw err;
    }
  }

  //fetch single  User
  async getUser(id) {
    try {
      const eitherUserOrNull = await this.findByIdWithRelations(id);
      if (!eitherUserOrNull) {
        throw new NotFoundException('User with given id not found');
      }

      const { password, ...rest } = eitherUserOrNull;
      return {
        user: {
          ...rest,
        },
      };
    } catch (err) {
      console.log('Error while gettting user', err);
      throw err;
    }
  }
}
