import jwt from 'jsonwebtoken'
import moment from 'moment'
import httpStatus from 'http-status'
import * as process from 'node:process'
import { Token } from '../models/token.model.js'
import ApiError from '../utils/ApiError.js'
import { IUser } from '../models/user.model.js'
import { IToken } from '../models/token.model.js'
import { tokenTypes } from '../enums/constants/token.constant.js'
import { getUserByEmail } from './user.service.js'

/**
 * Generate token
 * @param {string} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: string,
  expires: moment.Moment,
  type: string,
  secret: string = process.env.JWT_SECRET as string
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }
  return jwt.sign(payload, secret)
}

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<IToken>}
 */
export const saveToken = async (
  token: string,
  userId: string,
  expires: moment.Moment,
  type: string,
  blacklisted: boolean = false
): Promise<IToken> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted
  })
  return tokenDoc
}

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<IToken>}
 */
export const verifyToken = async (token: string, type: string): Promise<IToken> => {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string)
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false })
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found')
  }
  return tokenDoc
}

/**
 * Generate auth tokens
 * @param {IUser} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user: IUser, RTExpires?: Date) => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes')
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS)

  const refreshTokenExpires = RTExpires
    ? moment(RTExpires)
    : moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days')
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH)
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  }
}

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email')
  }
  const expires = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes')
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD)
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD)
  return resetPasswordToken
}

/**
 * Generate verify email token
 * @param {IUser} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
  const expires = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes')
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL)
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL)
  return verifyEmailToken
}
