import { Request, Response } from "express";
import Comment from "../../models/Movies/commentModel"
import Movie from "../../models/Movies/movieModel"
import { responseMessage, responseObject, paginte } from "../../utils/helpers";

export const getComments = async (req: Request, res: Response) => {
  const { movieId } = req.params

  if (!movieId) return responseMessage(400, res, "Movie ID is required")

  const commentsQuery = Comment.find({ movieId: req.params.movieId })

  const comments = await paginte(commentsQuery, Number(req.query.page))

  if (comments) return responseObject(200, res, comments)
  responseMessage(200, res, "No comments were found!")
}


export const createComments = async (req: Request, res: Response) => {
  const { body } = req.body
  const { movieId } = req.params
  const { _id } = req.session.user

  if (!movieId) return responseMessage(400, res, "Movie ID is required")

  const movie = await Movie.findById(movieId)

  if (!movie) return responseMessage(400, res, "Movie not found")

  const comment = await Comment.create({
    body,
    movieId: movie._id,
    userId: _id
  })

  movie.comments.push(comment)
  movie.save()

  if (comment) return res.status(201).send(comment)
}
