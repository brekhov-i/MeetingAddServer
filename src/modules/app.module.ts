import { Module } from '@nestjs/common';
import { CityModule } from './city.module';
import { CuratorModule } from './curator.module';
import { MeetingModule } from './meeting.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get('DB_USER'));
        return {
          uri: `mongodb+srv://${configService.get(
            'DB_USER',
          )}:${configService.get(
            'DB_PASSWORD',
          )}@cluster0.bxbecbc.mongodb.net/?retryWrites=true&w=majority`,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CityModule,
    CuratorModule,
    MeetingModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
