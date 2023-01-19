import { sign } from "jsonwebtoken"
import { IAuth } from "../../types/Auth/authTypes"

const generateToken = (user) => {

  const secret = process.env.NX_JWT_SECRET;

  return sign(user.toJSON(), secret)
}

const createUserToken = (user: IAuth) => {

  return generateToken(user)

}


export {
  createUserToken
}
