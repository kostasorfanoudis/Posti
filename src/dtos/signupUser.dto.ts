import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
export class SignupUserDto {
    
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 
    {message:'Password must contain at least one uppercase letter, one number and be at least 8 characters long'})
    password: string;
  }
  