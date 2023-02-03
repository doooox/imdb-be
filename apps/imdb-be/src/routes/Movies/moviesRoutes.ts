import * as express from 'express'
import { likeStatus } from '../../controllers/Movies/likeController'
import { createMovie, getMovies, getSearchedMovies, getSingleMovie } from '../../controllers/Movies/moviesController'
import { isAdmin, isAuth } from '../../middleware/Auth/authMiddleware'
import validateRequest from '../../middleware/validation/validationMiddleware'
import likesValidator from '../../validator/Movies/likesValidator'
import moviesValidator from '../../validator/Movies/movieValidator'

const moviesRouter = express.Router()

moviesRouter.get("/", isAuth, getMovies)
moviesRouter.get("/find", isAuth, getSearchedMovies)
moviesRouter.post("/create", isAuth, isAdmin, moviesValidator, validateRequest, createMovie)
moviesRouter.get("/:id", isAuth, getSingleMovie)
moviesRouter.put("/likes/:movieId", isAuth, likesValidator, validateRequest, likeStatus)


export default moviesRouter
