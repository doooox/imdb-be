import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { responseMessage } from "../../utils/helpers";



// const isAuth = (req, res: Response, next: NextFunction) => {
//   const authorization = req.headers.authorization


//   if (!authorization) {
//     return res.status(401).json({
//       message: "Missing authorization header!"
//     })
//   }

//   const token = authorization.split(" ")[1];
//   let jwtData;
//   try {
//     jwtData = verify(token, "1234");

//   } catch (error) {
//     console.log(error);

//     return res.status(401).json({
//       message: "Invalid Token."
//     })
//   }

//   req.user = jwtData.user;

//   next();

// }


export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next()
  } else {
    responseMessage(401, res, "User not authenticated!")
  }
}


export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session.user);

  if (!req.session.user) {
    next()
  } else {
    responseMessage(403, res, "User already authenticated")
  }
}

export default isAuth
