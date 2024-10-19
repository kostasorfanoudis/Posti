import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
export class SignupUserDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
  }
  