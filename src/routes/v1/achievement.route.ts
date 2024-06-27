import express, { Request, Response } from 'express'
import auth from '../../middlewares/auth.middleware.js'
import { AchievementController } from '../../controllers/achievement.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import AchievementValidation from '../../validations/achievement.validation.js'

const controller = new AchievementController()

const router = express.Router()

router.get('/', auth('GET_ACHIEVEMENTS'), validate(AchievementValidation.getAchievements), controller.getAchievements)
router.get(
  '/:achievementId',
  auth('GET_ACHIEVEMENTS'),
  validate(AchievementValidation.getAchievement),
  controller.getAchievement
)
router.post(
  '/',
  auth('MANAGE_ACHIEVEMENTS'),
  validate(AchievementValidation.createAchievement),
  controller.createAchievement
)
router.put(
  '/:achievementId',
  auth('MANAGE_ACHIEVEMENTS'),
  validate(AchievementValidation.updateAchievement),
  controller.updateAchievement
)
router.delete(
  '/:achievementId',
  auth('MANAGE_ACHIEVEMENTS'),
  validate(AchievementValidation.deleteAchievement),
  controller.deleteAchievement
)

export default router
