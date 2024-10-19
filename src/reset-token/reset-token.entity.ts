import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ResetToken {

  @PrimaryGeneratedColumn()
  id: number;  

  @Column()
  userId: number; 

  @Column()
  token: string
  
  @Column()
  expiryDate: Date;
}