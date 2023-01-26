export interface IMovie {
  _id: string,
  title: string,
  description: string,
  coverImage: string,
  genre: IGenre[]
}

export interface IGenre {
  _id: string,
  name: string
}
