import { Request, Response } from "express";
import Movie from "../../models/Movies/moviesModel"
import { responseObject, responseMessage } from "../../utils/helpers";


export const getMovies = async (req: Request, res: Response) => {

  const movies = await Movie.find()

  if (movies) {
    responseObject(200, res, movies)
  } else { responseMessage(200, res, "No moves were found!") }

}

export const createMovie = async (req: Request, res: Response) => {
  const { title, description, coverImage, genre } = req.body

  const movieExists = await Movie.exists({ title })
  if (movieExists) {
    return responseMessage(403, res, "Movie already exists")
  }

  const movie = await Movie.create({
    title,
    description,
    coverImage,
    genre
  })

  if (movie) {
    return res.status(201).send({
      title: movie.title,
      description: movie.description,
      coverImage: movie.coverImage,
      genre: movie.genre
    })
  }

  responseMessage(400, res, "Invalid movie data")
}
