import { Schema } from "mongoose";
import { IMovie } from "./moviesTypes";

export interface ILike {
  _id: string,
  movie: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
  state: "none" | "like" | "dislike"
}

export interface ILikeData extends ILike {
  totalLikes: number | undefined
  totalDislikes: number | undefined
}
export interface IMovieLike extends IMovie {
  likeData: ILikeData | undefined,
}
