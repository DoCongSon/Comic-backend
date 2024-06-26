import Joi from 'joi'
import { password } from './customs.validation.js'
import { SchemaValidator } from '../middlewares/validate.middleware.js'

const getUsers: SchemaValidator = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const getUser: SchemaValidator = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
}

const createUser: SchemaValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('USER', 'ADMIN')
  })
}

const updateUser: SchemaValidator = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  }),
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    name: Joi.string(),
    role: Joi.string().valid('USER', 'ADMIN')
  })
}

const deleteUser: SchemaValidator = {
  params: Joi.object().keys({
    userId: Joi.string().required()
  })
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
