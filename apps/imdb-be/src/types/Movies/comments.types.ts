import { Schema } from "mongoose";

export interface IComment {
  _id: string,
  body: string,
  movieId: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
}
