import { checkSchema } from "express-validator";

const moviesValidator = checkSchema({
  title: {
    in: "body",
    notEmpty: true,
    errorMessage: "Title field is required",
    isLength: {
      options: { min: 2 },
      errorMessage: "Title must have at least 2 character!"
    },
  },
  description: {
    in: "body",
    notEmpty: true,
    errorMessage: "Description field is required",
    isLength: {
      options: { min: 10 },
      errorMessage: "Description must have at least 10 character!"
    }
  },
  coverImage: {
    in: "body",
    notEmpty: true,
    errorMessage: "Cover image field is required",
    isURL: true
  },
  genres: {
    in: "body",
    notEmpty: true,
    errorMessage: "Genre field is required!",
  }
})

export default moviesValidator
