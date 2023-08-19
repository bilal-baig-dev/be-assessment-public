import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedUserPayload } from 'auth/types/auth-type';
import { CreateTaskDto } from 'task/dto/create-task.dto';
import { Task } from 'task/entities/task.entity';
import { Repository } from 'typeorm';
import { UserRegisterLoginDto } from 'user/dto/register-user.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  //helper functions
  async find(where, select = []) {
    return await this.taskRepository.findOne({ where, select });
  }

  async findByIdWithRelations(id: number) {
    return this.taskRepository.findOne({
      where: { id },
    });
  }

  //user register
  async createTask(id, body: CreateTaskDto) {
    try {
      const { name } = body;

      // Save the user and return it
      const createdTask = await this.taskRepository.save({
        user: id,
        name,
      });

      //destructuring user
      const { user, ...rest } = createdTask;

      console.log(createdTask, 'createdTask');
      const responseBody = {
        task: {
          ...rest,
        },
      };
      return responseBody;
    } catch (err) {
      throw err;
    }
  }

  //fetch single  User
  async getAllTasks(id) {
    try {
      const tasks = await this.taskRepository.find({
        where: {
          user: {
            id,
          },
        },
        //load relation (This is how I load relation that we have discussed in the interview (createdBy))
        // relations: ['user'],
      });
      return {
        tasks,
      };
    } catch (err) {
      console.log('Error while gettting user', err);
      throw err;
    }
  }
}
