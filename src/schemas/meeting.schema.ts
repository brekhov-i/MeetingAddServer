import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Curator } from './curator.schema';
import { City } from './city.schema';

export type MeetingDocument = HydratedDocument<Meeting>;

@Schema()
export class Meeting {
  @Prop()
  title: string;

  @Prop()
  date: string;

  @Prop()
  geo: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Curator' })
  curator: Curator;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
