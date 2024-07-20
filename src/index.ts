import express, { Express, NextFunction, Request, Response } from 'express'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import morgan from 'morgan'
import cors from 'cors'
import passport from 'passport'
import helmet from 'helmet'
import session from 'express-session'
import swaggerUi from 'swagger-ui-express'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { googleStrategy, jwtStrategy } from './config/passport.config.js'
import router from './routes/index.js'
import { errorConverter, errorHandler } from './middlewares/error.middleware.js'
import ApiError from './utils/ApiError.js'
import { authLimiter } from './middlewares/rateLimiter.middleware.js'
import logger from './config/logger.config.js'
import envConfig from './config/env.config.js'
import { swaggerDocs } from './config/swagger.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app: Express = express()
const port = envConfig.port

// session
app.use(
  session({
    secret: envConfig.session.secret,
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

// set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// passport middleware
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)
passport.use('google', googleStrategy)

// swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// limit repeated failed requests to auth endpoints
if (envConfig.env === 'production') {
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
    await mongoose.connect(envConfig.mongo.uri)
    const server = app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`)
    })
  } catch (error) {
    console.error(error)
  }
}

start()
