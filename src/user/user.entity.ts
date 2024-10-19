import { Post } from "src/posts/post.entity";

import { Role } from "src/roles/schemas/role.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @Column('jsonb',{nullable:true})
  role: Role; // Establish a Many-to-One relationship with the Role entity

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
