import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id: number;  // Automatically generated primary key

  @Column()
  userId: number; // Primary key column

  @Column()
  token: string
  
  @CreateDateColumn()
  expiryDate: Date;
}