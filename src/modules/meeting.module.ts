import { Module } from '@nestjs/common';
import { MeetingController } from 'src/controllers/meeting.controller';
import { MeetingService } from 'src/services/meeting.service';

@Module({
  imports: [],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
