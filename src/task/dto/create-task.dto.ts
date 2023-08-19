import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'Task Name is required',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be a String' })
  name: string;
}
