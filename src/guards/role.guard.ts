import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/schemas/role.schema';
import { IRole, IUser } from 'src/types/user';

export class RoleGuard implements CanActivate {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user: IUser = request?.user;
      if (!user) {
        throw new HttpException(
          'Пользователь не авторизован!',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const userRole: IRole = await this.roleModel.findById(user.role);
      if (userRole.name === 'superadmin') return true;
      const isAccess: boolean = roles.includes(userRole.name);
      if (!isAccess) {
        throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
      }
      return true;
    } catch {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
