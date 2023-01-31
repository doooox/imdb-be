import * as express from 'express'
import { createComments, getComments } from '../../controllers/Movies/commentsController'
import { isAuth } from '../../middleware/Auth/authMiddleware'
import validateRequest from '../../middleware/validation/validationMiddleware'
import commentValidator from '../../validator/Movies/commentValidator'

const commentRouter = express.Router()

commentRouter.get("/", isAuth, getComments)
commentRouter.post("/create", isAuth, commentValidator, validateRequest, createComments)

export default commentRouter
