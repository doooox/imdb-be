import mongoose from "mongoose";
import { IGenres } from "../../types/Movies/moviesTypes";

const Schema = mongoose.Schema
export const genresSchema = new Schema<IGenres>({
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model("Genres", genresSchema)
