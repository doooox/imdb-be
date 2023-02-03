import { ILike } from "../Movies/likes.types"

export interface IUser {
  id: string,
  email: string,
  name: string,
  password: string
  isAdmin?: boolean,
  likes: ILike[]
}
