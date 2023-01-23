import mongoose from "mongoose";
import { IMovie } from "../../types/Movies/moviesTypes";
import Genre from './genreModel'

const Schema = mongoose.Schema

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
    min: [2, "Title must contain at least 2 characters"]
  },
  description: {
    type: String,
    required: true,
    min: [10, "Descrption must contain at least 10 characters"]
  },
  coverImage: {
    type: String,
    required: true
  },
  genre: Genre
}, {
  timestamps: true

})


export default mongoose.model("Movie", movieSchema)
