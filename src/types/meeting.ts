import { ObjectId } from 'mongoose';

export interface IMeeting {
  _id?: string | ObjectId;
  title: string;
  date: string;
  geo: string;
  description: string;
  curator: string;
  city: string;
}
