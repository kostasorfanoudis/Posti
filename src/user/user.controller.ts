import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { UserService } from "./user.service";
import { join } from "path";
import { LoginUserDto } from "src/loginUserDto.dto";
import { SignupUserDto } from "src/signupUser.dto";
import { User } from "./user.entity";

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

  @Get('login')
  login(@Body() loginUserDto: LoginUserDto) {
    this.userService.login(loginUserDto);
  }

  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto, @Res() res: Response) {
    try {
      // Perform the signup logic, such as saving the user to the database
       await this.userService.signup(signupUserDto);
    } catch (error) {
      console.error('Signup error:', error);
      // Handle errors (optional: redirect to an error page or return a response with error message)
      return res.status(500).json({ message: 'Signup failed' });
    }
  }

  @Get('signup_page')
  signup_page(@Res() response: Response) {
    const filePath = join(__dirname, '..', '..', 'public', 'signup.html');
    return response.sendFile(filePath);
  }
  @Get('all')
  async findAll() {
    this.userService.findAll();
    }
  }
  

