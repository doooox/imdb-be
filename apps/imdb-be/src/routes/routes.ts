import * as express from 'express'
import authRouter from './auth/authRoutes'
import genresRouter from './Movies/genresRoute'
import moviesRouter from './Movies/moviesRoutes'

const router = express.Router()

router.use("/auth", authRouter)
router.use("/movies", moviesRouter)
router.use("/genres", genresRouter)

export default router
