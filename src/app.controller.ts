import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { Resource } from "./roles/enums/resource.enum";
import { Action } from "./roles/enums/action.enum";
import {Permissions} from './decorators/permissions.decorator';
import { AuthorizationGuard } from "./guards/authorization.guard";
@UseGuards(AuthenticationGuard,AuthorizationGuard)
@Controller('products')
export class AppController{

    @Permissions([{resource:Resource.products, actions: [Action.read]}])
    @Get('demo')
    someProtectedRoute(@Req() req){
        console.log('helo');
    }
}