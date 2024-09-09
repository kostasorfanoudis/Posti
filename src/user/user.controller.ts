import { Body, Controller, Get, Param, Post, Res, HttpStatus, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { UserService } from "./user.service";
import { join } from "path";
import { LoginUserDto } from "src/dtos/loginUserDto.dto";
import { SignupUserDto } from "src/dtos/signupUser.dto";
import { RefreshTokenDto } from "src/refresh_token/refresh_token.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login_page')
  login_page(@Res() response: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'login.html');
    return response.sendFile(filePath);
  }

  @Get('home')
  home_page(@Res() response: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'home.html');
    return response.sendFile(filePath);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const token = await this.userService.login(loginUserDto);
      return res.status(HttpStatus.OK).json(token);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Login failed' });
    }
  }

  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto, @Res() res: Response) {
    try {
      await this.userService.signup(signupUserDto);
      return res.status(HttpStatus.CREATED).json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Signup failed' });
    }
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
    try {
      const token = await this.userService.refreshTokens(refreshTokenDto.refreshToken);
      return res.status(HttpStatus.OK).json(token);
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
    }
  }

  @Get('signup_page')
  signup_page(@Res() response: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'signup.html');
    return response.sendFile(filePath);
  }

  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      console.error('Fetch all users error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch users' });
    }
  }
}
