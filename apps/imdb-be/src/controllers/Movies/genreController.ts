import { Request, Response } from "express";
import Genres from "../../models/Movies/genreModel"
import { responseObject, responseMessage } from "../../utils/helpers";

export const getGenres = async (req: Request, res: Response) => {
  const genres = await Genres.find()

  if (genres) return responseObject(200, res, genres)

  responseMessage(200, res, "No moves were found!")
}
