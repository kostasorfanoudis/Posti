import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { RefreshToken } from "src/refresh_token/refresh_token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, RefreshToken])],  // Combine both entities in a single forFeature call
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule],  // Export UserService and TypeOrmModule to be used in other modules
})
export class UserModule {}
