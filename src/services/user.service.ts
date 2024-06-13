import { IUser, User } from '../models/user.model.js'
import { Options } from '../models/plugins/paginate.plugin.js'
import ApiError from '../utils/ApiError.js'
import httpStatus from 'http-status'
import { ObjectId } from 'mongoose'

type OptionalIUser = Partial<IUser>

export const queryUsers = async (filter: any, options: Options) => {
  const users = await User.paginate(filter, options)
  return users
}

export const getUserById = async (id: ObjectId) => {
  return User.findById(id)
}

export const updateUserById = async (userId: ObjectId, updateBody: OptionalIUser) => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  Object.assign(user, updateBody)
  await user.save()
  return user
}

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email })
}
