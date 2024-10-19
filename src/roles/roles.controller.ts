import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "src/dtos/create_role.dto";


@Controller('roles')
export class RolesController{
    constructor(private readonly roleService: RolesService){}

    @Post('create_role')
    async createRole(@Body() role: CreateRoleDto){
        return this.roleService.createRole(role);
    }

    @Get('all')
    async getRoles(){
        return this.roleService.getAll();
    }
    
}