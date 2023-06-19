import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Role } from 'src/schemas/role.schema';
import { User } from 'src/schemas/user.schema';

import * as bcrypt from 'bcrypt';
import { IPayload, IRole, IUser, IUserDto } from 'src/types/user';
import { TokenService } from './token.service';
import { UserDto } from 'src/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private readonly tokenService: TokenService,
  ) {}

  async registration(
    email: string,
    password: string,
    name: string,
    roleId: string,
  ) {
    const candidate = await this.userModel.findOne({ email });

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email найден',
        HttpStatus.CONFLICT,
      );
    }

    const hashPass: string = await bcrypt.hash(password, 3);
    const role: IRole = roleId
      ? await this.roleModel.findById(roleId)
      : await this.roleModel.findOne({ name: 'curator' });
    const user: Document<any, any, IUser> = new this.userModel({
      name,
      email,
      password: hashPass,
      role,
    });
    await user.save();
    const userData: IUser = await this.userModel.findById(user.id);
    const userDto: IUserDto = new UserDto(userData);
    const tokens: { accessToken: string; refreshToken: string } =
      await this.tokenService.generateTokens({ ...userDto });

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email: string, password: string) {
    const user: IUser | null = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new HttpException('Введен неверный пароль', HttpStatus.BAD_REQUEST);
    }
    const userDto: IUserDto = new UserDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Ошибка авторизации', HttpStatus.UNAUTHORIZED);
    }
    const userData: IPayload = await this.tokenService.validateRefreshToken(
      refreshToken,
    );
    const tokenFromDb = this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new HttpException('Ошибка авторизации', HttpStatus.UNAUTHORIZED);
    }

    const user: IUser = await this.userModel.findById(userData.id);
    const userDto: IUserDto = new UserDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getUsers() {
    const users: IUser[] = await this.userModel.find();

    return users;
  }
}
