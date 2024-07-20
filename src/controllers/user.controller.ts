import { Request, Response } from 'express'
import * as userService from '../services/user.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'

export class UserController {
  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'role'])
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate'])
    const result = await userService.queryUsers(filter, options)
    res.status(httpStatus.OK).send(result)
  })

  public getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.userId)
    res.status(httpStatus.OK).send(user)
  })

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body)
    res.status(httpStatus.CREATED).send(user)
  })

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const updateBody = req.body
    const user = await userService.updateUserById(req.params.userId, updateBody)
    res.status(httpStatus.OK).send(user)
  })

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUserById(req.params.userId)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public updatePointsAndLevel = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updatePointsAndLevel(req.params.userId, req.body.points)
    res.status(httpStatus.OK).send(user)
  })

  public addAchievementToUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.addAchievementToUser(req.params.userId, req.body.achievementId)
    res.status(httpStatus.OK).send(user)
  })

  public removeAchievementFromUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.removeAchievementFromUser(req.params.userId, req.params.achievementId)
    res.status(httpStatus.OK).send(user)
  })
}
