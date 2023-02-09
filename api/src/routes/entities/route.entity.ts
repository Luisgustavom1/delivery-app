import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RouteDocument = Route & Document;

@Schema()
export class Route {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop(
    raw({
      lan: { type: Number },
      lng: { type: Number },
    }),
  )
  startPosition: { lat: number; lng: number };

  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  endPosition: { lat: number; lng: number };
}

export const RouteSchema = SchemaFactory.createForClass(Route);
