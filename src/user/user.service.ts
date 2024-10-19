import { BadRequestException, Injectable, NotFoundException, Res, UnauthorizedException } from "@nestjs/common";
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
import { nanoid } from "nanoid";
import { ResetToken } from "src/reset-token/reset-token.entity";
import { MailService } from "src/mail.service";
import { Role } from "src/roles/schemas/role.entity";
import { RolesService } from "src/roles/roles.service";



@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        @InjectRepository(ResetToken)
        private resetTokenRepository: Repository<ResetToken>,

        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private jwtService: JwtService,
        private mailService: MailService,
        private rolesService: RolesService
    ) {}

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersRepository.findOneBy({ username: loginUserDto.username });
        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = await this.generateUserToken(user.id);
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

    async changePassword(userId,oldPassword: string, newPassword: string){
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if(!user){
            throw new NotFoundException("User not found !!!");
        }
        const passwordMatch = await bcrypt.compare(oldPassword,user.password);
        if(!passwordMatch){
            throw new UnauthorizedException("Worng credentials");
        }

        const newHashedPassword = await bcrypt.hash(newPassword,10);
        user.password = newHashedPassword;
        await this.usersRepository.save(user);
    }

    async forgotPassword(email: string){
        const user = await this.usersRepository.findOne({ where: { email: email } });
        if(!user){
            throw new NotFoundException("User with this email not found !!!");
        }
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const resetToken= nanoid(64);
        await this.resetTokenRepository.save({
            token: resetToken,
            userId: user.id,
            expiryDate: expiryDate
        });
        

        this.mailService.sendPasswordResetEmail(email,resetToken);
        
        return{
            message:"If this user exists, they will receive an email "
        };
    }

    async resetPassword(newPassword: string, resetToken: string){
        const token = await this.resetTokenRepository.findOne({where:{
            token: resetToken,
            expiryDate: MoreThanOrEqual( new Date())
            }});
        if(!token){
            throw new UnauthorizedException("Reset token is invalid");
        }
        
        const user = await this.usersRepository.findOneBy( {id: token.userId});
        (await user).password = await bcrypt.hash(newPassword,10);
        await this.usersRepository.save(user);
        await this.resetTokenRepository.remove(token);
    }

    async changeRole(userId: number, roleId: number){
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if(!user){
            throw new NotFoundException("User with this id not found !!!");
        }
        const role = await this.rolesRepository.findOne({ where: { id: roleId } });
        if(!role){
            throw new NotFoundException("Role with this id not found !!!");
        }
        console.log(userId);
        console.log(roleId);
        const newUser = this.usersRepository.create({
            username: user.username,
            email: user.email,
            password: user.password,  // Hash password before saving
            role: role,  // Assign the new role to the new user
        });
        await this.usersRepository.delete({id: userId});
        await this.usersRepository.save(newUser);
        
    }

    async getUserPermissions(userId: number){
        const user = await this.usersRepository.findOne({where: {id: userId}});

        if(!user){
            throw new BadRequestException("User  with that id not found");
        }
        return user.role;

        
    }
}