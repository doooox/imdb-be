export interface IMovie {
  id: string,
  title: string,
  description: string,
  coverImage: string,
  genre: IGenre[]
}

export interface IGenre {
  id: string,
  name: string
}
