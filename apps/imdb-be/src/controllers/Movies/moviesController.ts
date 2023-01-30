import { Request, Response } from "express";
import Movie from "../../models/Movies/movieModel"
import Genres from "../../models/Movies/genreModel"
import { responseObject, responseMessage, paginte } from "../../utils/helpers";
import { IGenres } from "../../types/Movies/moviesTypes";

export const getMovies = async (req: Request, res: Response) => {

  const movies = await paginte(Movie.find(), Number(req.query.page))

  if (movies) return responseObject(200, res, movies)
  responseMessage(200, res, "No moves were found!")

}

export const getSingleMovie = async (req: Request, res: Response) => {

  const movie = await Movie.findById(req.params.id)

  if (movie) return res.status(200).json(movie)
  responseMessage(200, res, "No moves were found!")

}

export const getSearchedMovies = async (req: Request, res: Response) => {
  const { search } = req.query

  const searchedMovies = await Movie.find({ title: { $regex: search, $options: "i" } }).select("_id, title ").limit(5)

  res.status(200).json(searchedMovies)
}

export const createMovie = async (req: Request, res: Response) => {
  const { title, description, coverImage, genres } = req.body

  const movieExists = await Movie.exists({ title })
  if (movieExists) {
    return responseMessage(403, res, "Movie already exists")
  }

  const movieGenres = await Promise.all(genres.map(async (genre: IGenres) => {
    return await Genres.findById(genre._id)
  }))


  const movie = await Movie.create({
    title,
    description,
    coverImage,
    genres: movieGenres
  })

  if (movie) {
    return res.status(201).send(movie)
  }

  responseMessage(400, res, "Invalid movie data")
}
