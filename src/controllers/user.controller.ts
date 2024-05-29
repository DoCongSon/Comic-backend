import { Body, Post, Route, Response, Tags, SuccessResponse, Get } from 'tsoa'
import { Request as EXRequest, Response as EXResponse } from 'express'
import * as userService from '../services/user.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'

@Route('user')
@Tags('User')
export class UserController {
  @Get('/')
  public getUsers = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const filter = pick(req.query, ['name', 'role'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await userService.queryUsers(filter, options)
    res.status(httpStatus.OK).send(result)
  })
}
