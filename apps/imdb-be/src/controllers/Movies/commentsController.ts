import { Request, Response } from "express";
import Comment from "../../models/Movies/commentModel"
import { responseMessage, responseObject, paginte } from "../../utils/helpers";

export const getComments = async (req: Request, res: Response) => {
  const comments = await paginte(Comment.find(), Number(req.query.page))

  if (comments) return responseObject(200, res, comments)
  responseMessage(200, res, "No comments were found!")
}


export const createComments = async (req: Request, res: Response) => {
  const { body } = req.body

  const comment = await Comment.create({
    body
  })

  if (comment) return res.status(201).send(comment)

}
