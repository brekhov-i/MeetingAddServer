import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { MeetingService } from 'src/services/meeting.service';
import { IMeeting } from 'src/types/meeting';

@Controller('/meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getAllMeeting(@Res() response: Response) {
    try {
      const meetings: IMeeting[] = await this.meetingService.getAllMeeting();

      response.send(meetings);
    } catch (e) {
      response.send(e);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getMeetingById(
    @Param() param: { id: string },
    @Res() response: Response,
  ) {
    try {
      const meeting: IMeeting = await this.meetingService.getMeetingById(
        param.id,
      );

      response.send(meeting);
    } catch (e) {
      response.send(e);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createMeeting(@Body() body: IMeeting, @Res() response: Response) {
    try {
      const meeting: IMeeting = await this.meetingService.createMeeting(body);

      response.send(meeting);
    } catch (e) {
      response.send(e);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateMeeting(
    @Param() param: { id: string },
    @Body() body: IMeeting,
    @Res() response: Response,
  ) {
    try {
      const meeting: IMeeting = await this.meetingService.updateMeeting(
        param.id,
        body,
      );

      response.send(meeting);
    } catch (e) {
      response.send(e);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteMeeting(
    @Param() param: { id: string },
    @Res() response: Response,
  ) {
    try {
      const result: HttpException = await this.meetingService.deleteMeeting(
        param.id,
      );

      response.send(result);
    } catch (e) {
      response.send(e);
    }
  }
}
