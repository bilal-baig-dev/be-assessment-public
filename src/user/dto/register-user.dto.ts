import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UserRegisterLoginDto {
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
    description: 'Email you used for creating the account',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a valid string' })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    type: String,
    required: true,
    description: 'Associated password with the given email',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password should be a String' })
  @MinLength(8, { message: 'Password must be atleast 8 characters longer' })
  password: string;
}
