import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/services/token.service';
import { IPayload } from 'src/types/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const token: string = this.extractTokenFromHeader(request);
      console.log(request);
      if (!token) {
        throw new HttpException(
          'Пользователь не авторизован',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userData: IPayload = await this.tokenService.validateAccessToken(
        token,
      );

      if (!userData) {
        throw new HttpException(
          'Пользователь не авторизован',
          HttpStatus.UNAUTHORIZED,
        );
      }

      request['user'] = userData;
    } catch {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
