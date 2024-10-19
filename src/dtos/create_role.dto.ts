import { Type } from "class-transformer";
import { ArrayUnique, IsArray, IsEnum, IsJSON, IsString, ValidateNested } from "class-validator";
import { Action } from "src/roles/enums/action.enum";
import { Resource } from "src/roles/enums/resource.enum";

export class CreateRoleDto{
    @IsString()
    name: string;

    @IsArray()
    permissions: JSON;
}
