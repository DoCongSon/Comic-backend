import { Request, Response } from 'express'
import * as paymentService from '../services/payment.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'

export class PaymentController {
  public getPayments = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['user'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await paymentService.queryPayments(filter, options)
    res.status(httpStatus.OK).send(result)
  })

  public getPayment = catchAsync(async (req: Request, res: Response) => {
    const payment = await paymentService.getPaymentById(req.params.paymentId)
    res.status(httpStatus.OK).send(payment)
  })

  public createPayment = catchAsync(async (req: Request, res: Response) => {
    const payment = await paymentService.createPayment(req.body)
    res.status(httpStatus.CREATED).send(payment)
  })

  public updatePayment = catchAsync(async (req: Request, res: Response) => {
    const payment = await paymentService.updatePaymentById(req.params.paymentId, req.body)
    res.status(httpStatus.OK).send(payment)
  })

  public deletePayment = catchAsync(async (req: Request, res: Response) => {
    await paymentService.deletePaymentById(req.params.paymentId)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public handlePayment = catchAsync(async (req: Request, res: Response) => {
    await paymentService.handlePayment(req.params.paymentId)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
