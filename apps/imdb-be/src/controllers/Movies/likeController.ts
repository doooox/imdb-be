import { Request, Response } from "express";
import { responseMessage, responseObject } from "../../utils/helpers";
import Movie from "../../models/Movies/movieModel"
import Like from "../../models/Movies/likeModel"
import User from "../../models/User/userModel"


export const likeStatus = async (req: Request, res: Response) => {
  const { movieId } = req.params
  const { state } = req.body
  const { _id } = req.session.user

  if (!movieId) return responseMessage(400, res, "Id undefined")

  if (state !== "none" && state !== "like" && state !== "dislike") return responseMessage(400, res, "Invalid state")

  const movie = await Movie.findOne({ _id: movieId }, ["_id", "likes"])
  if (!movie) return responseMessage(400, res, "Movie not found")

  let likeState = await Like.findOne({ user: _id, movie: movieId })

  if (likeState) {
    likeState.state = state
    await likeState.save()
  } else {
    likeState = await Like.create({
      state,
      user: _id,
      movie: movieId
    })
    movie.likes.push(likeState)
    const user = await User.findById(_id)
    if (!user.likes) user.likes = []
    user.likes.push(likeState)
    user.save()
    movie.save()
  }

  const likeData = await Like.findOne({ movie: movie._id, user: _id })
  const totalLikes = await Like.count({ movie: movie._id, state: "like" })
  const totalDislikes = await Like.count({ movie: movie._id, state: "dislike" })

  const movieLike = {
    movie: {
      _id: movie._id
    },
    likeData: {
      state: likeData?.state,
      user: likeData?.user,
      movie: likeData?.movie,
      _id: likeData?._id,
      totalLikes,
      totalDislikes
    }
  }


  return responseObject(201, res, movieLike)

}
