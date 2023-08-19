import { BaseEntity } from 'shared/base.entity';
import { Task } from 'task/entities/task.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  task: Task[];
}
