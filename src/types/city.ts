import { ObjectId } from 'mongoose';

export interface ICity {
  _id?: string | ObjectId;
  name: string;
  image: string;
  chatLink: string;
}

export type ICityWithId = ICity;
