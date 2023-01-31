import * as express from 'express'
import { createComments, getComments } from '../../controllers/Movies/commentsController'
import { isAuth } from '../../middleware/Auth/authMiddleware'
import validateRequest from '../../middleware/validation/validationMiddleware'
import commentValidator from '../../validator/Movies/commentValidator'

const commentRouter = express.Router()

commentRouter.post("/create/:movieId", isAuth, commentValidator, validateRequest, createComments)
commentRouter.get("/:movieId", isAuth, getComments)


export default commentRouter
