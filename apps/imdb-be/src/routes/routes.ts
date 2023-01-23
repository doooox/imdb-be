import * as express from 'express'
import authRouter from './auth/authRoutes'
import moviesRouter from './Movies/moviesRoutes'

const router = express.Router()

router.use("/auth", authRouter)
router.use("/movies", moviesRouter)

export default router
