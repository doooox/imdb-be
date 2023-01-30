import { Request, Response } from "express";
import Movie from "../../models/Movies/movieModel"
import Genres from "../../models/Movies/genreModel"
import { responseObject, responseMessage, paginte } from "../../utils/helpers";
import { IGenres, IMovie } from "../../types/Movies/moviesTypes";
import { Pagination } from "../../types/pagination/pagination.types";


export const getMovies = async (req: Request, res: Response) => {
  const genres = req.body.genres
  let movies: Pagination<IMovie> | undefined;
  if (genres) {

    try {
      const query = Movie.find({ 'genres': { $elemMatch: { _id: genres } } })
      movies = await paginte(query, Number(req.query.page))

    } catch (error) {
      responseMessage(200, res, "No moves were found!")
    }

  } else {
    const query = Movie.find()
    movies = await paginte(query, Number(req.query.page))
  }

  if (movies) return responseObject(200, res, movies)
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
