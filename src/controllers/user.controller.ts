import { Request as EXRequest, Response as EXResponse } from 'express'
import * as userService from '../services/user.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'

export class UserController {
  public getUsers = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const filter = pick(req.query, ['name', 'role'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await userService.queryUsers(filter, options)
    res.status(httpStatus.OK).send(result)
  })

  public getUser = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const user = await userService.getUserById(req.params.userId)
    res.status(httpStatus.OK).send(user)
  })

  public createUser = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const user = await userService.createUser(req.body)
    res.status(httpStatus.CREATED).send(user)
  })

  public updateUser = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const updateBody = req.body
    const user = await userService.updateUserById(req.params.userId, updateBody)
    res.status(httpStatus.OK).send(user)
  })

  public deleteUser = catchAsync(async (req: EXRequest, res: EXResponse) => {
    await userService.deleteUserById(req.params.userId)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
