import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard, Roles } from 'src/guards/role.guard';
import { UserService } from 'src/services/user.service';
import { IUser, IUserRegisterBody } from 'src/types/user';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('superadmin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('/registration')
  async registration(
    @Res() response: Response,
    @Body() body: IUserRegisterBody,
  ) {
    try {
      const result = await this.userService.registration(
        body.email,
        body.password,
        body.name,
        body.role,
      );

      response.cookie('refreshToken', result.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      response.send(result);
    } catch (e) {
      response.send(e);
    }
  }

  @Post('/login')
  async login(
    @Res() response: Response,
    @Body() body: { email: string; password: string },
  ) {
    try {
      const { email, password } = body;
      const userData = await this.userService.login(email, password);
      response.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      response.send(userData);
    } catch (e) {
      response.send(e);
    }
  }

  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    try {
      const { refreshToken }: { refreshToken: string } = request.cookies;
      const token = await this.userService.logout(refreshToken);
      response.clearCookie('regreshToken');
      response.send(token);
    } catch (e) {
      response.send(e);
    }
  }

  @Get('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    try {
      const { refreshToken }: { refreshToken: string } = request.cookies;
      const userData = await this.userService.refresh(refreshToken);
      response.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      response.send(userData);
    } catch (e) {
      response.send(e);
    }
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('/')
  async getUsers(@Res() response: Response) {
    try {
      const users: IUser[] = await this.userService.getUsers();

      response.send(users);
    } catch (e) {
      response.send(e);
    }
  }
}
