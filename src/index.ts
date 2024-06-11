import express, { Express, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import helmet from 'helmet'
import session from 'express-session'
import swaggerUi from 'swagger-ui-express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import * as process from 'node:process'
import { jwtStrategy } from './config/passport.config.js'
import router from './routes/index.js'
import { errorConverter, errorHandler } from './middlewares/error.middleware.js'
import ApiError from './utils/ApiError.js'
import { authLimiter } from './middlewares/rateLimiter.middleware.js'
import logger from './config/logger.config.js'

const app: Express = express()
dotenv.config()
const port = process.env.PORT || 3000

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
  })
)
// enable cors
app.use(cors())
app.options('*', cors())

// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self' 'unsafe-inline'"]
      }
    }
  })
)

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(express.static('public'))

// jwt authentication
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// swagger docs
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: 'docs/swagger.json'
    }
  })
)

// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV === 'production') {
  app.use('/v1/auth', authLimiter)
}

app.use('/api', router)

// 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// handle errors
app.use(errorConverter)
app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`)
    app.listen(port, () => {
      logger.info(`[server]: Server is running at http://localhost:${port}`)
      logger.info(`[server]: Documents is running at http://localhost:${port}/docs`)
    })
  } catch (error) {
    console.error(error)
  }
}

start()
