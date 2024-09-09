import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number; // Primary key column

  @Column()
  title: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @CreateDateColumn()
  creationDate: Date;
}