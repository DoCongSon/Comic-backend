import dotenv from 'dotenv'
import * as process from 'node:process'
import Joi from 'joi'

dotenv.config()

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    API_URL: Joi.string().required().description('API URL'),
    MONGO_URI: Joi.string().required().description('Mongo DB URL'),
    SESSION_SECRET: Joi.string().required().description('Session Secret'),
    COOKIE_PASSWORD: Joi.string().required().description('Cookie Password'),
    JWT_SECRET: Joi.string().required().description('JWT Secret'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('JWT Access Token Expiration Time'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('JWT Refresh Token Expiration Time'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('JWT Reset Password Token Expiration Time'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('JWT Verify Email Token Expiration Time'),
    GOOGLE_CLIENT_ID: Joi.string().required().description('Google Client ID'),
    GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google Client Secret'),
    SMTP_HOST: Joi.string().required().description('SMTP Host'),
    SMTP_PORT: Joi.number().required().description('SMTP Port'),
    SMTP_SECURITY: Joi.string().required().description('SMTP Security'),
    SMTP_USER: Joi.string().required().description('SMTP User'),
    SMTP_PASS: Joi.string().required().description('SMTP Password'),
    SMTP_FROM: Joi.string().required().description('SMTP From Email')
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiUrl: envVars.API_URL,
  mongo: {
    uri: envVars.MONGO_URI
  },
  session: {
    secret: envVars.SESSION_SECRET
  },
  cookie: {
    password: envVars.COOKIE_PASSWORD
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET
  },
  smtp: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    security: envVars.SMTP_SECURITY,
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
    from: envVars.SMTP_FROM
  }
}
