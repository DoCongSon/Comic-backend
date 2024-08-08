import Joi from 'joi'
import { SchemaValidator } from '../middlewares/validate.middleware.js'

const createPayment: SchemaValidator = {
  body: Joi.object().keys({
    user: Joi.string().required(),
    code: Joi.string().required(),
    ruby: Joi.number().required()
  })
}

const getPayment: SchemaValidator = {
  params: Joi.object().keys({
    paymentId: Joi.string().required()
  })
}

const getPayments: SchemaValidator = {
  query: Joi.object().keys({
    user: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const updatePayment: SchemaValidator = {
  params: Joi.object().keys({
    paymentId: Joi.string().required()
  }),
  body: Joi.object().keys({
    user: Joi.string(),
    code: Joi.string(),
    ruby: Joi.number()
  })
}

const deletePayment: SchemaValidator = {
  params: Joi.object().keys({
    paymentId: Joi.string().required()
  })
}

const handlePayment: SchemaValidator = {
  params: Joi.object().keys({
    paymentId: Joi.string().required()
  })
}

export default {
  createPayment,
  getPayment,
  getPayments,
  updatePayment,
  deletePayment,
  handlePayment
}
