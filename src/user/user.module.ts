import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { RefreshToken } from "src/refresh_token/refresh_token.entity";
import { ResetToken } from "src/reset-token/reset-token.entity";
import { MailService } from "src/mail.service";
import { Role } from "src/roles/schemas/role.entity";
import { RolesService } from "src/roles/roles.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshToken,ResetToken,Role])],  // Combine both entities in a single forFeature call
    providers: [UserService,MailService,RolesService],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule],  // Export UserService and TypeOrmModule to be used in other modules
})
export class UserModule {}
