import Joi from 'joi'
import { SchemaValidator } from '../middlewares/validate.middleware.js'

const createAchievement: SchemaValidator = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required()
  })
}

const getAchievement: SchemaValidator = {
  params: Joi.object().keys({
    achievementId: Joi.string().required()
  })
}

const getAchievements: SchemaValidator = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const updateAchievement: SchemaValidator = {
  params: Joi.object().keys({
    achievementId: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string()
  })
}

const deleteAchievement: SchemaValidator = {
  params: Joi.object().keys({
    achievementId: Joi.string().required()
  })
}

export default {
  createAchievement,
  getAchievement,
  getAchievements,
  updateAchievement,
  deleteAchievement
}
