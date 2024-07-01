import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { Token } from '../models/token.model.js'
import { tokenTypes } from '../enums/constants/token.constant.js'
import * as tokenService from '../services/token.service.js'
import * as userService from '../services/user.service.js'

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

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken: string) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH)
  const RTExpires = refreshTokenDoc.expires
  const user = await userService.getUserById(refreshTokenDoc.user)
  await Token.deleteOne({ _id: refreshTokenDoc._id })
  return tokenService.generateAuthTokens(user, RTExpires)
}

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<string>} newPassword
 */
export const resetPassword = async (resetPasswordToken: string) => {
  const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
  const user = await userService.getUserById(resetPasswordTokenDoc.user)
  const newPassword = userService.generatePassword()
  await userService.updateUserById(user.id, { password: newPassword })
  await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
  return newPassword
}

/**
 * Change password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const changePassword = async (resetPasswordToken: string, newPassword: string) => {
  const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
  const user = await userService.getUserById(resetPasswordTokenDoc.user)
  await userService.updateUserById(user.id, { password: newPassword })
  await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
}

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken: string) => {
  const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL)
  const user = await userService.getUserById(verifyEmailTokenDoc.user)
  await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
  await userService.updateUserById(user.id, { verified: true })
}
