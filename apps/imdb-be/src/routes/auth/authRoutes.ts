import * as express from 'express'
import { singiUser, singoutUser, singupUser } from '../../controllers/Auth/authController'
import validateRequest from '../../middleware/validation/validationMiddleware'
import isAuth, { isNotAuth } from '../../middleware/Auth/authMiddleware'
import singupValidator from '../../validator/Auth/registerValidator'
import singinValidator from '../../validator/Auth/singInValidator'

const authRouter = express.Router()

authRouter.post("/singup", singupValidator, isNotAuth, validateRequest, singupUser)
authRouter.post("/singin", singinValidator, isNotAuth, validateRequest, singiUser)
authRouter.post("/singout", isAuth, singoutUser)


export default authRouter
