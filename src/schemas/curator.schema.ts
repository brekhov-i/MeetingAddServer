import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { City } from './city.schema';

export type CuratorDocument = HydratedDocument<Curator>;

@Schema()
export class Curator {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;
}

export const CuratorSchema = SchemaFactory.createForClass(Curator);
