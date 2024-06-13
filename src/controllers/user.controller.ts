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
}
