import nodemailer from 'nodemailer'
import logger from '../config/logger.config.js'
import dotenv from 'dotenv'
import * as process from 'node:process'

dotenv.config()

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

if (process.env.NODE_ENV !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((error) => {
      console.log(error)
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    })
}

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const msg = { from: process.env.SMTP_FROM, to, subject, text }
  await transport.sendMail(msg)
}

const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password'
  const resetPasswordUrl = `${process.env.API_URL}/auth/reset-password?email=${to}&token=${token}`
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`
  await sendEmail(to, subject, text)
}

const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification'
  const verificationEmailUrl = `${process.env.API_URL}/auth/verify-email?token=${token}`
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`
  await sendEmail(to, subject, text)
}

const sendNewPasswordEmail = async (to: string, password: string): Promise<void> => {
  const subject = 'New Password'
  const text = `Dear user,
Your new password is: ${password}
Please change it after you login.`
  await sendEmail(to, subject, text)
}

export { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail, sendNewPasswordEmail }
