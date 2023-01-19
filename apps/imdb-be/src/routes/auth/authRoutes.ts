import * as express from 'express'
import { registerUser } from '../../controllers/Auth/authController'
import validateRequest from '../../middleware/validation/validationMiddleware'
import registerValidator from "../../validator/Auth/registerValidator"
import isAuth, { isNotAuth } from '../../middleware/Auth/authMiddleware'




const authRouter = express.Router()

authRouter.post("/register", registerValidator, isNotAuth, validateRequest, registerUser)
authRouter.get("/", isAuth, (req, res) => {
  res.send("Auth working")
})

export default authRouter
