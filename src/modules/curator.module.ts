import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CuratorController } from 'src/controllers/curator.controller';
import { City, CitySchema } from 'src/schemas/city.schema';
import { Curator, CuratorSchema } from 'src/schemas/curator.schema';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { CuratorService } from 'src/services/curator.service';
import { TokenService } from 'src/services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Curator.name, schema: CuratorSchema }]),
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [CuratorController],
  providers: [CuratorService, TokenService, JwtService],
})
export class CuratorModule {}
