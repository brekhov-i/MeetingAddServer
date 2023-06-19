import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CityController } from 'src/controllers/city.controller';
import { City, CitySchema } from 'src/schemas/city.schema';
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { CityService } from 'src/services/city.service';
import { TokenService } from 'src/services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (
          ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
            file.mimetype,
          )
        ) {
          callback(null, true);
        } else {
          callback(new Error('Неподдерживаемый тип файла'), false);
        }
      },
    }),
  ],
  controllers: [CityController],
  providers: [CityService, TokenService, JwtService],
})
export class CityModule {}
