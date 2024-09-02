import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}