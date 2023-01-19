import { Request, Response } from "express";
import Auth from "../../models/Auth/authModel"
import { genSalt, hash } from "bcryptjs";
import { responseMessage } from "../../utils/helpers";

const errorMessage = {
  "errors": [
    {
      "msg": "passwords dont match",
      "param": "confirmPassword",
      "location": "body"
    }
  ]
}

export const registerUser = async (req: Request, res: Response) => {
  const { email, name, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).send(errorMessage)
  }

  const userExists = await Auth.exists({ email })

  if (userExists) {
    return responseMessage(403, res, "User registerd!")

  }

  const salt = await genSalt(10)
  const hashedPassword = await hash(password, salt)

  const user = await Auth.create({
    name,
    email,
    password: hashedPassword
  })

  if (user) {
    req.session.user = user

    res.status(201).send({
      name: user.name,
      email: user.email
    })
  } else {
    responseMessage(400, res, "Invalid user data")
  }
}

