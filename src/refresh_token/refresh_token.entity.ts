import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id: number;  

  @Column()
  userId: number; 

  @Column()
  token: string
  
  @CreateDateColumn()
  expiryDate: Date;
}