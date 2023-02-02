import { IComment } from './comments.types';

export interface IMovie {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  genres: IGenres[];
  comments?: IComment[];
  views: number
}

export interface IGenres {
  _id: string;
  name?: string;
}
