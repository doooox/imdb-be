import { Response, Request } from "express"



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
  return res.status(status).json(object)
}
const paginationLimit = 12

export const paginte = async (query: any, page = 1) => {
  const skip = (page - 1) * paginationLimit
  const paginated = await query.skip(skip).limit(paginationLimit)

  let total: number | undefined
  try {
    total = await query.model.count()
  } catch (error) {
    total = await query._model.count()
  }

  return {
    metadata: {
      page,
      paginationLimit,
      count: paginated.length,
      total
    },
    data: paginated
  }
}

export const paginatedRequest = async (query: any, req: Request) => {
  const page: number = req.query['page'] ? Number(req.query["page"]) : 1
  return paginte(query, page)
}
