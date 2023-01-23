import mongoose from "mongoose";
import { IGenre } from "../../types/Movies/moviesTypes";

const Schema = mongoose.Schema
export const genreSchema = new Schema<IGenre>({
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model("Genre", genreSchema)
