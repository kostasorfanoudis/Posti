import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number; // Primary key column

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  creator: string;

  @CreateDateColumn()
  creationDate: Date;
}