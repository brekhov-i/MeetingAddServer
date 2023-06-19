import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  chatLink: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
