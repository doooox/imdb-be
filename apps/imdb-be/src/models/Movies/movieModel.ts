import mongoose from 'mongoose';
import { IMovie } from '../../types/Movies/moviesTypes';
import { genresSchema } from './genreModel';

const Schema = mongoose.Schema;

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      min: [2, 'Title must contain at least 2 characters'],
      unique: true,
    },
    description: {
      type: String,
      required: true,
      min: [10, 'Descrption must contain at least 10 characters'],
    },
    coverImage: {
      type: String,
      required: true,
    },
    genres: [genresSchema],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Movie', movieSchema);
