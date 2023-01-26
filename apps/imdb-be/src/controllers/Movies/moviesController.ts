import { Request, Response } from "express";
import Movie from "../../models/Movies/moviesModel"
import Genre from "../../models/Movies/genreModel"
import { responseObject, responseMessage } from "../../utils/helpers";
import { IGenre } from "../../types/Movies/moviesTypes";



export const getMovies = async (req: Request, res: Response) => {

  const movies = await Movie.find()

  if (movies) return responseObject(200, res, movies)
  responseMessage(200, res, "No moves were found!")

}

export const createMovie = async (req: Request, res: Response) => {
  const { title, description, coverImage, genre } = req.body

  const movieExists = await Movie.exists({ title })
  if (movieExists) {
    return responseMessage(403, res, "Movie already exists")
  }

  const genres = await Promise.all(genre.map(async (genre: IGenre) => {
    return await Genre.findById(genre._id)
  }))
  const movie = await Movie.create({
    title,
    description,
    coverImage,
    genres
  })

  if (movie) {
    return res.status(201).send(movie)
  }

  responseMessage(400, res, "Invalid movie data")
}
