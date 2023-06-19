import { ObjectId } from 'mongoose';

export interface IUser {
  _id?: string | ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserDto {
  email: string;
  id: string | ObjectId;
  role: string;
}

export interface IPayload {
  id: string | ObjectId;
  email: string;
  role: string;
}

export interface IToken {
  _id?: string | ObjectId;
  user: string;
  refreshToken: string;
}

export interface IRole {
  _id?: string | ObjectId;
  name: string;
  title: string;
}

export interface IUserRegisterBody {
  name: string;
  email: string;
  password: string;
  role: string;
}
