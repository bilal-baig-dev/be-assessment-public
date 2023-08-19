import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserRegisterLoginDto } from 'user/dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User Management')
@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Register User' })
  @ApiOkResponse({
    description: 'User Register successfully',
    isArray: false,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async create(@Body() body: UserRegisterLoginDto) {
    const createdUser = await this.userService.register({ ...body });
    return createdUser;
  }

  @ApiOperation({ description: 'Login' })
  @ApiOkResponse({
    description: 'Logged in successfully',
    isArray: false,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async loginUser(@Body() body: UserRegisterLoginDto) {
    const user = await this.userService.login({ ...body });
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'Get User',
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/user')
  async getSingleUser(@Req() req) {
    const id = req?.user?.id;
    const user = await this.userService.getUser(id);
    return user;
  }
}
