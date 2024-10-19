import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "src/dtos/create_role.dto";
import { Repository } from "typeorm";
import { Role } from "./schemas/role.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class RolesService{
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ){}


    async createRole(role: CreateRoleDto){
        return this.roleRepository.save(role);
    }

    async getRoleById(roleId: number){
        return this.roleRepository.findOneBy({id:roleId})
    }
     async getAll(){
        return this.roleRepository.find();
     }
}