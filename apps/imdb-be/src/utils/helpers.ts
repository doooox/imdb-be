import { Response } from "express"

export const responseMessage = (status: number, res: Response, message: string) => {
  return res.status(status).json({ message })
}
