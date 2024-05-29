import passport from 'passport'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { roleRights } from '../config/roles.config.js'

const verifyCallback =
  (req: any, resolve: any, reject: any, requiredRights: string[]) => async (err: any, user: any, info: any) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
    }
    req.user = user

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) || []
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight))
      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'))
      }
    }

    resolve()
  }

const auth =
  (...requiredRights: string[]) =>
  async (req: any, res: any, next: any) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      )
    })
      .then(() => next())
      .catch((err: any) => next(err))
  }

export default auth
