import { Body, Controller, Get, Param, Post, Res, HttpStatus, UseGuards, Put, Req, Patch } from "@nestjs/common";
import { Response } from 'express';
import { UserService } from "./user.service";
import { join } from "path";
import { LoginUserDto } from "src/dtos/loginUserDto.dto";
import { SignupUserDto } from "src/dtos/signupUser.dto";
import { RefreshTokenDto } from "src/refresh_token/refresh_token.dto";
import { ChangePasswordDto } from "src/dtos/changePassword.dto";
import { ForgotPasswordDto } from "src/dtos/forgot_password.dto";
import { ResetPasswordDto } from "src/dtos/resetPassword.dto";
import { AuthorizationGuard } from "src/guards/authorization.guard";

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
  @UseGuards(AuthorizationGuard)
  @Put('change_password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto,@Req() req){
    return this.userService.changePassword(req.userId,changePasswordDto.oldPassword,changePasswordDto.newPassword);
  }

  @Post('forgot_password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    return this.userService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset_password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto,@Req() req){
    return this.userService.resetPassword(resetPasswordDto.newPassword,resetPasswordDto.resetToken);
  }

  @Put('change_role')
  async changeRole(userId: number,roleId: number){
    return this.userService.changeRole(userId, roleId);
  }

  @Get('user_permissions')
  async getUserPermissions(userId: number){
    return this.userService.getUserPermissions(userId);
  }
}
