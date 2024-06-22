import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ejs from 'ejs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import * as process from 'node:process'
import logger from '../config/logger.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const msg = { from: process.env.SMTP_FROM, to, subject, html }
  await transport.sendMail(msg)
}

const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password'
  const resetPasswordUrl = `${process.env.API_URL}/auth/reset-password?email=${to}&token=${token}`

  const templatePath = path.join(__dirname, '../views/email', 'resetPassword.ejs')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const html = ejs.render(template, { resetPasswordUrl })

  await sendEmail(to, subject, html)
}

const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification'
  const verificationEmailUrl = `${process.env.API_URL}/auth/verify-email?token=${token}`
  const html = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`
  await sendEmail(to, subject, html)
}

const sendNewPasswordEmail = async (to: string, password: string): Promise<void> => {
  const subject = 'New Password'
  const html = `Dear user,
Your new password is: ${password}
Please change it after you login.`
  await sendEmail(to, subject, html)
}

export { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail, sendNewPasswordEmail }
