import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { City } from 'src/schemas/city.schema';
import { Curator } from 'src/schemas/curator.schema';
import { Meeting } from 'src/schemas/meeting.schema';
import { ICity } from 'src/types/city';
import { ICurator } from 'src/types/curator';
import { IMeeting } from 'src/types/meeting';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
    @InjectModel(Curator.name) private curatorModel: Model<Curator>,
    @InjectModel(City.name) private cityModel: Model<City>,
  ) {}

  //Get all meeting
  async getAllMeeting(): Promise<IMeeting[]> {
    const meetings: IMeeting[] = await this.meetingModel.find();

    return meetings;
  }

  //Get meeting by id
  async getMeetingById(id: string): Promise<IMeeting> {
    const meeting: IMeeting = await this.meetingModel.findById(id);

    return meeting;
  }

  //Create meeting
  async createMeeting(meetingData: IMeeting): Promise<IMeeting> {
    const candidate: IMeeting | null = await this.meetingModel.findOne({
      title: meetingData.title,
      city: meetingData.city,
      curator: meetingData.curator,
    });

    if (!candidate) {
      const curator: ICurator = await this.curatorModel.findById(
        meetingData.curator,
      );
      const city: ICity = await this.cityModel.findById(meetingData.city);
      const newMeeting: Document<any, any, IMeeting> = new this.meetingModel({
        ...meetingData,
        city,
        curator,
      });

      return await newMeeting.save().then(() => {
        return this.meetingModel.findById(newMeeting.id);
      });
    } else {
      throw new HttpException(
        'Такая встреча уже существует',
        HttpStatus.CONFLICT,
      );
    }
  }

  //Update meeting
  async updateMeeting(id: string, meetingData: IMeeting): Promise<IMeeting> {
    const meeting: IMeeting = await this.meetingModel.findById(id);
    const curatorId: string = meeting.curator;
    const cityId: string = meeting.city;

    let curator: ICurator = await this.curatorModel.findById(curatorId);
    let city: ICity = await this.cityModel.findById(cityId);

    if (meetingData.curator) {
      curator = await this.curatorModel.findById(meetingData.curator);
    }

    if (meetingData.city) {
      city = await this.curatorModel.findById(meetingData.city);
    }

    await this.meetingModel.updateOne(
      { _id: id },
      {
        ...meetingData,
        curator,
        city,
      },
    );

    const updatedMeeting: IMeeting = await this.meetingModel.findById(id);

    return updatedMeeting;
  }

  //Delete meeting
  async deleteMeeting(id: string): Promise<HttpException> {
    const meeting: IMeeting = await this.meetingModel.findById(id);

    await this.meetingModel.deleteOne({ _id: id });

    throw new HttpException(`Встреча ${meeting.title} удалена`, HttpStatus.OK);
  }
}
