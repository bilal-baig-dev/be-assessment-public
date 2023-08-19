import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from 'task/dto/create-task.dto';
import { TaskService } from 'task/services/task.services';

@ApiTags('Task Management')
@Controller('/')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ description: 'Create Task' })
  @ApiOkResponse({
    description: 'Task Created successfully',
    isArray: false,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/create-task')
  async create(@Req() req, @Body() body: CreateTaskDto) {
    const id = req?.user?.id;
    const createdTask = await this.taskService.createTask(id, body);
    return createdTask;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'Get User',
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/list-tasks')
  async getTaskList(@Req() req) {
    const id = req?.user?.id;
    const user = await this.taskService.getAllTasks(id);
    return user;
  }
}
