import { checkSchema } from "express-validator";

const likesValidator = checkSchema({
  state: {
    in: "body",
    notEmpty: true,
    errorMessage: "State must be defined",
    isString: true
  },
})

export default likesValidator
