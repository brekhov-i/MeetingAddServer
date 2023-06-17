import { Module } from '@nestjs/common';
import { CuratorController } from 'src/controllers/curator.controller';
import { CuratorService } from 'src/services/curator.service';

@Module({
  imports: [],
  controllers: [CuratorController],
  providers: [CuratorService],
})
export class CuratorModule {}
