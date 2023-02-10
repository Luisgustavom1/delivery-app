import { Position } from "./position";

export interface Route {
  _id: string;
  title: string;
  startPosition: Position;
  endPosition: Position
}