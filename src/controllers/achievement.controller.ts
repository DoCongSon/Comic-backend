import { Request as EXRequest, Response as EXResponse } from 'express'
import * as achievementService from '../services/achievement.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'

export class AchievementController {
  public getAchievements = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const filter = pick(req.query, ['name'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await achievementService.queryAchievements(filter, options)
    res.status(httpStatus.OK).send(result)
  })

  public getAchievement = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const achievement = await achievementService.getAchievementById(req.params.achievementId)
    res.status(httpStatus.OK).send(achievement)
  })

  public createAchievement = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const achievement = await achievementService.createAchievement(req.body)
    res.status(httpStatus.CREATED).send(achievement)
  })

  public updateAchievement = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const updateBody = req.body
    const achievement = await achievementService.updateAchievementById(req.params.achievementId, updateBody)
    res.status(httpStatus.OK).send(achievement)
  })

  public deleteAchievement = catchAsync(async (req: EXRequest, res: EXResponse) => {
    await achievementService.deleteAchievementById(req.params.achievementId)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
