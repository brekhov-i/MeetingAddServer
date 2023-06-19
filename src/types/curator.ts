import { ObjectId } from 'mongoose';

export interface ICurator {
  _id?: string | ObjectId;
  name: string;
  city: string;
}
