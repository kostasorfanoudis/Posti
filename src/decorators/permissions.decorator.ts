import { SetMetadata } from "@nestjs/common";

export const Permissions = (permissions)=> SetMetadata("permissions",permissions);