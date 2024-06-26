import { CreateUser, IUser, User } from '../models/user.model.js'
import { Options } from '../models/plugins/paginate.plugin.js'
import ApiError from '../utils/ApiError.js'
import httpStatus from 'http-status'
import { ObjectId } from 'mongoose'

type OptionalIUser = Partial<IUser>

export const queryUsers = async (filter: any, options: Options) => {
  const users = await User.paginate(filter, options)
  return users
}

export const getUserById = async (id: ObjectId | string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  return user
}

export const createUser = async (userBody: CreateUser) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  return User.create(userBody)
}

export const updateUserById = async (userId: ObjectId | string, updateBody: OptionalIUser) => {
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

export const deleteUserById = async (userId: ObjectId | string) => {
  const user = await getUserById(userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  await user.deleteOne()
}

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email })
}

export const generatePassword = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const all = letters + numbers
  let password = ''
  password += letters[Math.floor(Math.random() * letters.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  for (let i = 0; i < 8; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }
  return password
}
