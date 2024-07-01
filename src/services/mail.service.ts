import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import logger from '../config/logger.config.js'
import envConfig from '../config/env.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const transport = nodemailer.createTransport({
  host: envConfig.smtp.host,
  port: envConfig.smtp.port,
  auth: {
    user: envConfig.smtp.user,
    pass: envConfig.smtp.pass
  }
})

if (envConfig.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((error) => {
      console.log(error)
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    })
}

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const msg = { from: envConfig.smtp.from, to, subject, html }
  await transport.sendMail(msg)
}

const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password'
  const resetPasswordUrl = `${envConfig.apiUrl}/auth/reset-password?email=${to}&token=${token}`

  const templatePath = path.join(__dirname, '../views/email', 'resetPassword.ejs')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const html = ejs.render(template, { resetPasswordUrl })

  await sendEmail(to, subject, html)
}

const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification'
  const verificationEmailUrl = `${envConfig.apiUrl}/auth/verify-email?token=${token}`

  const templatePath = path.join(__dirname, '../views/email', 'verifyEmail.ejs')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const html = ejs.render(template, { verificationEmailUrl })

  await sendEmail(to, subject, html)
}

const sendNewPasswordEmail = async (to: string, password: string): Promise<void> => {
  const subject = 'New Password'

  const templatePath = path.join(__dirname, '../views/email', 'newPassword.ejs')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const html = ejs.render(template, { password })

  await sendEmail(to, subject, html)
}

export { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail, sendNewPasswordEmail }
