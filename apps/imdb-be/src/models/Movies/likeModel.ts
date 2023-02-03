import mongoose from "mongoose";
import { ILike } from "../../types/Movies/likes.types";


const Schema = mongoose.Schema

export const likeSchema = new Schema<ILike>({
  movie: {
    type: Schema.Types.ObjectId,
    ref: "Movie"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  state: {
    type: String,
    default: "none"
  }
}, {
  timestamps: true
})

export default mongoose.model("Like", likeSchema)
