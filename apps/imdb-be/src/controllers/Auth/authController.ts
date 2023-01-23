import { Request, Response } from "express";
import Auth from "../../models/Auth/authModel"
import { genSalt, hash, compare } from "bcryptjs";
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

export const singupUser = async (req: Request, res: Response) => {
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

export const singiUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await Auth.findOne({ email })

  if (!user) {
    return responseMessage(404, res, "Invalid email or password")
  }

  const matchingPasswords = await compare(password, user.password)

  if (!matchingPasswords) {
    return responseMessage(400, res, "Invalid email or password")
  }

  req.session.user = user

  res.status(201).send({
    name: user.name,
    email: user.email
  })
}

export const singoutUser = async (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      responseMessage(400, res, "Unable to log out!")
    } else {
      responseMessage(200, res, "User is logged out!")
    }
  })

}

