import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { CreatePayment, Payment } from '../models/payment.model.js'
import { getUserById, incrementRuby } from './user.service.js'

const createPayment = async (paymentBody: CreatePayment) => {
  await getUserById(paymentBody.user)
  return Payment.create(paymentBody)
}

const getPaymentById = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId)
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found')
  }
  return payment
}

const queryPayments = async (filter: any, options: any) => {
  const payments = await Payment.paginate(filter, options)
  return payments
}

const updatePaymentById = async (paymentId: string, updateBody: Partial<CreatePayment>) => {
  const payment = await getPaymentById(paymentId)
  Object.assign(payment, updateBody)
  await payment.save()
  return payment
}

const deletePaymentById = async (paymentId: string) => {
  const payment = await getPaymentById(paymentId)
  await payment.deleteOne()
}

const handlePayment = async (paymentId: string) => {
  const payment = await getPaymentById(paymentId)
  await incrementRuby(payment.user, payment.ruby)
  await payment.deleteOne()
}

export { createPayment, getPaymentById, queryPayments, updatePaymentById, deletePaymentById, handlePayment }
