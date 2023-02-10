import { Position } from "./position";

export interface Route {
  id: string;
  title: string;
  startPosition: Position;
  endPosition: Position
}