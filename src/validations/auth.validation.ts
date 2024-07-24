import Joi from 'joi'
import { password } from './customs.validation.js'
import { SchemaValidator } from '../middlewares/validate.middleware.js'

const register: SchemaValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required()
  })
}

const login: SchemaValidator = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}

const google: SchemaValidator = {
  query: Joi.object().keys({
    return: Joi.string().required()
  })
}

const logout: SchemaValidator = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const refreshTokens: SchemaValidator = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const forgotPassword: SchemaValidator = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
}

const resetPassword: SchemaValidator = {
  query: Joi.object().keys({
    token: Joi.string().required(),
    email: Joi.string().email().required()
  })
}

const changePassword: SchemaValidator = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password)
  })
}

const verifyEmail: SchemaValidator = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
}

const updateProfile: SchemaValidator = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    avatar: Joi.string()
  })
}

export default {
  register,
  login,
  google,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  updateProfile
}
