import { Injectable } from "@nestjs/common";
import { LoginUserDto } from "src/loginUserDto.dto";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignupUserDto } from "src/signupUser.dto";
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}

      async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.usersRepository.findOneBy({ username: loginUserDto.username });
    
        if (!user) {
            throw new Error('User not found');
        }
    
        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
    
        return 'Login successful';
    }
    

    async signup(signupUserDto: SignupUserDto): Promise<string> {
        // Check if a user with the same email or username already exists
        const existingUser = await this.usersRepository.findOneBy({ email: signupUserDto.email });
        
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(signupUserDto.password, 10);

        // Create a new User instance and save it to the database
        const newUser = this.usersRepository.create({
            username: signupUserDto.username,
            email: signupUserDto.email,
            password: hashedPassword,
        });

        await this.usersRepository.save(newUser);

        return 'Signup successful';
    }

   async findAll(){
        const users = await this.usersRepository.find();
        users.map(user => console.log(user));
    }
}