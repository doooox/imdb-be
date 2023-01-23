import { checkSchema } from "express-validator"

const singinValidator = checkSchema({
  email: {
    in: "body",
    isEmail: true,
    errorMessage: "Input must have a value of email"
  },
  password: {
    in: "body",
    notEmpty: true,
    errorMessage: "Invalid password"
  },
})

export default singinValidator
