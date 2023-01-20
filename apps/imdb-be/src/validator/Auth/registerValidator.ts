import { checkSchema } from "express-validator"

const singupValidator = checkSchema({
  email: {
    in: "body",
    isEmail: true,
    errorMessage: "Input must have a value of email"
  },
  name: {
    in: "body",
    notEmpty: true,
    errorMessage: "Enter name"
  },
  password: {
    in: "body",
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must have at least 6 chars"
    }
  },
})

export default singupValidator
