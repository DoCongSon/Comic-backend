import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { Token } from '../models/token.model.js'
import { tokenTypes } from '../enums/constants/token.constant.js'

export const register = async (data: { email: string; password: string; name: string }) => {
  const { email, password, name } = data
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken')
  }
  const user = await User.create({ email, password, name })
  return user
}

export const loginWithEmailAndPassword = async (data: { email: string; password: string }) => {
  const { email, password } = data
  const user = await User.findOne({ email })
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
  }
  return user
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false })
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
  }
  await refreshTokenDoc.deleteOne()
}
