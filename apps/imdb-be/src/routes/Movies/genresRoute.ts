import * as express from 'express'
import { getGenres } from '../../controllers/Movies/genreController'
import isAuth from '../../middleware/Auth/authMiddleware'

const genresRouter = express.Router()

genresRouter.get("/", getGenres, isAuth)

export default genresRouter
