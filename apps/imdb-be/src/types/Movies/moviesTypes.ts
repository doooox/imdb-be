import { IComment } from './comments.types';
import { ILike } from './likes.types';

export interface IMovie {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  genres: IGenres[];
  comments?: IComment[];
  views: number
  likes?: ILike[]
}

export interface IGenres {
  _id: string;
  name?: string;
}

