import { Response } from "express"


export const responseMessage = (status: number, res: Response, message: string) => {
  return res.status(status).json({
    errors: [
      {
        value: '',
        msg: message,
        param: "",
        location: "body"
      }
    ]
  })
}

export const responseObject = (status: number, res: Response, object: object) => {
  return res.status(status).send(object)
}

