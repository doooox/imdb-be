export interface IMovie {
  _id: string,
  title: string,
  description: string,
  coverImage: string,
  genres: IGenres[]
}

export interface IGenres {
  _id: string,
  name: string
}
