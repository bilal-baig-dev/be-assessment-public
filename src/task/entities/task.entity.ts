import { BaseEntity } from 'shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'user/entities/user.entity';

@Entity('task')
export class Task extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User | number;
}
