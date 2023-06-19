import { ObjectId } from 'mongoose';
import { IUser } from 'src/types/user';

export class UserDto {
  email: string;
  role: string;
  id: string | ObjectId;

  constructor(model: IUser) {
    this.email = model.email;
    this.id = model._id.toString();
    this.role = model.role.toString();
  }
}
