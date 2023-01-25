import * as express from 'express'
import { createMovie, getMovies } from '../../controllers/Movies/moviesController'
import isAuth from '../../middleware/Auth/authMiddleware'
import validateRequest from '../../middleware/validation/validationMiddleware'
import moviesValidator from '../../validator/Movies/movieValidator'

const moviesRouter = express.Router()

moviesRouter.get("/", getMovies, isAuth)
moviesRouter.post("/create", isAuth, moviesValidator, validateRequest, createMovie)

export default moviesRouter
