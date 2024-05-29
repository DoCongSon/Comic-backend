import { Body, Post, Route, Response, Tags, SuccessResponse } from 'tsoa'
import { Request as EXRequest, Response as EXResponse } from 'express'
import * as authService from '../services/auth.service.js'
import * as tokenService from '../services/token.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'

interface RegisterRequest {
  email: string
  password: string
  name: string
}

interface LoginRequest {
  email: string
  password: string
}

interface LogoutRequest {
  refreshToken: string
}

@Route('auth')
@Tags('Auth')
export class AuthController {
  @Post('/register')
  public register = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const user = await authService.register(req.body)
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.CREATED).send({ user, tokens })
  })

  @Post('/login')
  public login = catchAsync(async (req: EXRequest, res: EXResponse) => {
    const { email, password } = req.body
    const user = await authService.loginWithEmailAndPassword({ email, password })
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.OK).send({ user, tokens })
  })

  @Post('/logout')
  public logout = catchAsync(async (req: EXRequest, res: EXResponse) => {
    await authService.logout(req.body.refreshToken)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
