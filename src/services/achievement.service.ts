import httpStatus from 'http-status'
import { ObjectId } from 'mongoose'
import { Achievement, CreateAchievement } from '../models/achievement.model.js'
import { Options } from '../models/plugins/paginate.plugin.js'
import ApiError from '../utils/ApiError.js'

export const queryAchievements = async (filter: any, options: Options) => {
  const users = await Achievement.paginate(filter, options)
  return users
}

export const getAchievementById = async (achievementId: ObjectId | string) => {
  const achievement = await Achievement.findById(achievementId)
  if (!achievement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Achievement not found')
  }
  return achievement
}

export const createAchievement = async (achievementBody: CreateAchievement) => {
  if (await Achievement.isNameTaken(achievementBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Achievement already taken')
  }
  return Achievement.create(achievementBody)
}

export const updateAchievementById = async (
  achievementId: ObjectId | string,
  updateBody: Partial<CreateAchievement>
) => {
  const achievement = await getAchievementById(achievementId)
  if (updateBody.name && (await Achievement.isNameTaken(updateBody.name, achievementId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Achievement already taken')
  }
  Object.assign(achievement, updateBody)
  await achievement.save()
  return achievement
}

export const deleteAchievementById = async (achievementId: ObjectId | string) => {
  const achievement = await getAchievementById(achievementId)
  if (!achievement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Achievement not found')
  }
  await achievement.deleteOne()
}
