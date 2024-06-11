import mongoose from 'mongoose'
import httpStatus from 'http-status'
import logger from '../config/logger.config.js'
import ApiError from '../utils/ApiError.js'
import { Request, Response, NextFunction } from 'express'
import * as process from 'node:process'

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  }

  if (process.env.NODE_ENV === 'development') {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}

export { errorConverter, errorHandler }
