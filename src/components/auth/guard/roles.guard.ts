import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user?.payload?.user;
    if (!user || !user.roles) {
      return false;
    }
    const hasRole = () => user.roles.some((role) => roles.indexOf(role) > -1);
    let hasPermission = false;

    if (hasRole()) {
      hasPermission = true;
      // const email = req.params.email || req.body.email;
      // if (email) {
      //   if (user.email.toLowerCase() != email.toLowerCase()) {
      //     hasPermission = false;
      //   }
      // }
    }
    return user && user.roles && hasPermission;
  }
}
