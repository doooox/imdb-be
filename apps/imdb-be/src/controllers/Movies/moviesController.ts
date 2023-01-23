import { Request, Response } from "express";
import Movie from "../../models/Movies/moviesModel"
import { responseObject, responseMessage } from "../../utils/helpers";


export const getMovies = async (req: Request, res: Response) => {

  const movies = await Movie.find()

  if (movies) {
    responseObject(200, res, movies)
  } else { responseMessage(200, res, "No moves were found!") }

}
