import * as express from 'express'
import { createMovie, getMovies, getSingleMovie } from '../../controllers/Movies/moviesController'
import { isAdmin, isAuth } from '../../middleware/Auth/authMiddleware'
import validateRequest from '../../middleware/validation/validationMiddleware'
import moviesValidator from '../../validator/Movies/movieValidator'

const moviesRouter = express.Router()

moviesRouter.get("/", isAuth, getMovies)
moviesRouter.get("/:id", isAuth, getSingleMovie)
moviesRouter.post("/create", isAuth, isAdmin, moviesValidator, validateRequest, createMovie)


export default moviesRouter
