import Joi from 'joi'
import { SchemaValidator } from '../middlewares/validate.middleware.js'

const createCategory: SchemaValidator = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required()
  })
}

const getCategory: SchemaValidator = {
  params: Joi.object().keys({
    categoryId: Joi.string().required()
  })
}

const getCategories: SchemaValidator = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const updateCategory: SchemaValidator = {
  params: Joi.object().keys({
    categoryId: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string()
  })
}

const deleteCategory: SchemaValidator = {
  params: Joi.object().keys({
    categoryId: Joi.string().required()
  })
}

export default {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory
}
