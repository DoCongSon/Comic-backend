import { Request, Response } from 'express'
import httpStatus from 'http-status'
import * as authService from '../services/auth.service.js'
import * as tokenService from '../services/token.service.js'
import * as mailService from '../services/mail.service.js'
import catchAsync from '../utils/catchAsync.js'
import { IUser } from '../models/user.model.js'

export class AuthController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.register(req.body)
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.CREATED).send(tokens)
  })

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await authService.loginWithEmailAndPassword({ email, password })
    const tokens = await tokenService.generateAuthTokens(user)
    res.status(httpStatus.OK).send(tokens)
  })

  public logout = catchAsync(async (req: Request, res: Response) => {
    await authService.logout(req.body.refreshToken)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public me = catchAsync(async (req: Request, res: Response) => {
    const user = req.user
    res.status(httpStatus.OK).send(user)
  })

  public refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken)
    res.status(httpStatus.OK).send({ ...tokens })
  })

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const newPassword = await authService.resetPassword(req.query.token as string)
    await mailService.sendNewPasswordEmail(req.query.email as string, newPassword)
    res.render('resetPassword', { email: req.query.email })
  })

  public changePassword = catchAsync(async (req: Request, res: Response) => {
    await authService.changePassword(req.body.refreshTokens, req.body.newPassword)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email)
    await mailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    await authService.verifyEmail(req.body.token)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user as IUser)
    await mailService.sendVerificationEmail(req.body.email, verifyEmailToken)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
