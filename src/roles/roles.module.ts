import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./schemas/role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { Module } from "@nestjs/common";


@Module({
    imports:[TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService]
})
export class RolesModule{}