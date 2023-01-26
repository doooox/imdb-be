import { Request, Response } from "express";
import Genre from "../../models/Movies/genreModel"
import { responseObject, responseMessage } from "../../utils/helpers";

export const getGenres = async (req: Request, res: Response) => {
  const genres = await Genre.find()

  if (genres) return responseObject(200, res, genres)

  responseMessage(200, res, "No moves were found!")
}
