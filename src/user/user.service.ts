import { Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "src/dtos/loginUserDto.dto";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignupUserDto } from "src/dtos/signupUser.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "src/refresh_token/refresh_token.entity";
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDto } from "src/refresh_token/refresh_token.dto";
import { MoreThanOrEqual } from "typeorm";



@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService
    ) {}

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersRepository.findOneBy({ username: loginUserDto.username });
        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = await this.generateUserToken(user.id);
        const refreshtoken = uuidv4();
        console.log(refreshtoken);
        return  token;
        
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

    async generateUserToken(userId){
        const accesstoken = this.jwtService.sign({userId},{expiresIn:'20m'});
        console.log(accesstoken);
        const refreshToken = uuidv4();
        await this.storeRefreshToken(refreshToken,userId);
        return {accesstoken,refreshToken};
        
    }

    
    async storeRefreshToken(refreshToken: string, userId: number) {
    const existingToken = await this.refreshTokenRepository.findOne({ where: { userId } });

    if (existingToken) {
        // Update existing token's expiry date and token value
        existingToken.token = refreshToken;
        existingToken.expiryDate = new Date();
        existingToken.expiryDate.setDate(existingToken.expiryDate.getDate() + 3);
        await this.refreshTokenRepository.save(existingToken);
    } else {
        // Create a new token if none exists
        const newRefreshToken = this.refreshTokenRepository.create({
            userId,
            token: refreshToken,
            expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        });
        await this.refreshTokenRepository.save(newRefreshToken);
    }

}

    async refreshTokens(refreshToken: string){
        const token = await this.refreshTokenRepository.findOne({where:{
            token: refreshToken,
            expiryDate: MoreThanOrEqual( new Date())
            }});

        if(!token){
            throw new UnauthorizedException("Refresh token is invalid");
        }

        return this.generateUserToken((await token).userId);
    }
    async findAll(){
        const users = await this.usersRepository.find();
        users.map(user => console.log(user));
    }

    async findOne(username: string): Promise<User | undefined>{
        return this.usersRepository.findOne({ where: { username: username } });
    }

}