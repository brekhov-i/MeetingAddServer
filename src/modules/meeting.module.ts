import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingController } from 'src/controllers/meeting.controller';
import { City, CitySchema } from 'src/schemas/city.schema';
import { Curator, CuratorSchema } from 'src/schemas/curator.schema';
import { Meeting, MeetingSchema } from 'src/schemas/meeting.schema';
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { MeetingService } from 'src/services/meeting.service';
import { TokenService } from 'src/services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    MongooseModule.forFeature([{ name: Curator.name, schema: CuratorSchema }]),
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [MeetingController],
  providers: [MeetingService, TokenService, JwtService],
})
export class MeetingModule {}
