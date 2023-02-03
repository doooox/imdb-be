import { Request, Response } from "express";
import Movie from "../../models/Movies/movieModel"
import Genres from "../../models/Movies/genreModel"
import Like from "../../models/Movies/likeModel"
import { responseObject, responseMessage, paginte } from "../../utils/helpers";
import { IGenres } from "../../types/Movies/moviesTypes";
import { Pagination } from "../../types/pagination/pagination.types";
import { IMovieLike } from "../../types/Movies/likes.types";



export const getMovies = async (req: Request, res: Response) => {
  const { genres } = req.query
  const { _id } = req.session.user

  let parsedGenres = genres
  if (genres) {
    parsedGenres = JSON.parse(genres as string)
  }

  let movies: Pagination<IMovieLike[]> | undefined;

  try {
    let query
    let total
    if (parsedGenres?.length > 0) {
      query = Movie.find({ 'genres': { $elemMatch: { _id: parsedGenres } } }, ["_id", "title", "coverImage", "genres", "views"]).lean()
      total = await Movie.find({ 'genres': { $elemMatch: { _id: parsedGenres } } }).count()
      movies = await paginte(query, Number(req.query.page), total)
    } else {
      query = Movie.find({}, ["_id", "title", "coverImage", "genres", "views"]).lean()
      movies = await paginte(query, Number(req.query.page))
    }
    movies.data = await Promise.all(movies.data?.map(async (movie) => {
      const likeData = await Like.findOne({ movie: movie._id, user: _id })
      const totalLikes = await Like.count({ movie: movie._id, state: "like" })
      const totalDislikes = await Like.count({ movie: movie._id, state: "dislike" })
      return {
        ...movie,
        likeData: {
          state: likeData?.state,
          user: likeData?.user,
          movie: likeData?.movie,
          _id: likeData?._id,
          totalLikes,
          totalDislikes
        }
      }
    }))
  } catch (error) {
    console.log(error);

    responseMessage(200, res, "No moves were found!")
  }

  if (movies) return responseObject(200, res, movies)
}

export const getSingleMovie = async (req: Request, res: Response) => {

  const movie = await Movie.findById(req.params.id)
  movie.views++
  movie.save()

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
