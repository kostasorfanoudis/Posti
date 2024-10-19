


import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number; // Primary key column

  @Column()
  name: string;

  @Column('jsonb',{nullable:true})
  permissions: JSON

  
}
