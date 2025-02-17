import { IsString } from "class-validator";

export class ResetPasswordDto{
    @IsString()
    newPassword: string;

    @IsString()
    resetToken: string;
}