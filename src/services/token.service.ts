import { Token } from './../schemas/token.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IPayload, IToken } from 'src/types/user';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(payload: IPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      privateKey: this.configService.get('JWT_ACCESS_KEY'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      privateKey: this.configService.get('JWT_REFRESH_KEY'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verifyAsync(token, {
        publicKey: this.configService.get('JWT_ACCESS_KEY'),
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verifyAsync(token, {
        publicKey: this.configService.get('JWT_REFRESH_KEY'),
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId: string | ObjectId, refreshToken: string) {
    const tokenData: IToken = await this.tokenModel.findOne({ user: userId });
    if (tokenData) {
      return await this.tokenModel.updateOne(
        { _id: tokenData._id },
        { refreshToken },
      );
    }
    const token: Document<any, any, IToken> = new this.tokenModel({
      user: userId,
      refreshToken,
    });

    await token.save();

    return token.toObject();
  }

  async removeToken(refreshToken: string) {
    const tokenData = await this.tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}
