import { Request, Response, NextFunction } from 'express'
import Joi, { Schema } from 'joi'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'

interface ValidatedRequest extends Request {
  [key: string]: any
}

const validate =
  (schema: { body: Joi.ObjectSchema<any> }) => (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const validSchema: Schema = schema.body
    const object = req.body
    const { value, error } = validSchema.validate(object)
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ')
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
    }
    Object.assign(req, value)
    return next()
  }

export default validate
