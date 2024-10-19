import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.userId) {
            throw new UnauthorizedException("User ID not found!");
        }

        // Fetch route permissions
        const requiredRoutePermissions: JSON = this.reflector.getAllAndOverride<JSON>("permissions", [
            context.getHandler(),
            context.getClass(),
        ]);

        console.log(`Required route permissions: ${JSON.stringify(requiredRoutePermissions)}`);

        
            const userPermissions = await this.userService.getUserPermissions(request.userId); // Ensure this is async if needed
            console.log(`user permissions: ${JSON.stringify(userPermissions)}`);

            // for (const routePermission of requiredRoutePermissions) {
            //     const userPermission = userPermissions.find(perm => perm.resource === routePermission.resource);
                
            //     if (!userPermission) {
            //         throw new ForbiddenException("Permission denied: resource not found.");
            //     }

            //     const allActionsAvailable = routePermission.actions.every(
            //         (requiredAction) => userPermission.actions.includes(requiredAction)
            //     );

            //     if (!allActionsAvailable) {
            //         throw new ForbiddenException("Permission denied: insufficient actions.");
            //     }
            // }
        

        return true;
    }
}
