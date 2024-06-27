import ApiError from '../utils/ApiError.js'
import { IUser } from './../models/user.model.js'
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

/**
 * Middleware to check if the user has enough rubies.
 * Throws an error if the user does not have enough rubies.
 * Deducts the specified amount of rubies from the user's progress.
 * Saves the updated user progress.
 * Calls the next middleware in the chain.
 *
 * @param ruby - The amount of rubies required.
 */
const ruby = (ruby: number) => async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser
  if (user.progress.ruby < ruby) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough rubies')
  }
  user.progress.ruby -= ruby
  await user.save()
  next()
}

export default ruby
