import mongoose from "mongoose";
import { IComment } from "../../types/Movies/comments.types";

const Schema = mongoose.Schema

export const commentsSchema = new Schema<IComment>({
  body: {
    type: String,
    required: true,
    maxlength: [500, "Comment can't have more than 500 characters"]
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Auth"
  }
}, {
  timestamps: true
})

export default mongoose.model("Comment", commentsSchema)
