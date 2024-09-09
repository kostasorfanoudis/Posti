import { Post } from "src/posts/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Primary key column

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}