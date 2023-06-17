import { Module } from '@nestjs/common';
import { CityController } from 'src/controllers/city.controller';
import { CityService } from 'src/services/city.service';

@Module({
  imports: [],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
