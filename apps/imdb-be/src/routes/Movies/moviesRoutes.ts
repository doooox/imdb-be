import * as express from 'express'
import { getMovies } from '../../controllers/Movies/moviesController'



const moviesRouter = express.Router()

moviesRouter.get("/", getMovies)


export default moviesRouter
