import { checkSchema } from "express-validator";

const commentValidator = checkSchema({
  body: {
    in: "body",
    notEmpty: true,
    errorMessage: "Comment body is required",
    isLength: {
      options: { max: 500 },
      errorMessage: "Comment can't have more than 500 characters"
    }
  },
})

export default commentValidator
