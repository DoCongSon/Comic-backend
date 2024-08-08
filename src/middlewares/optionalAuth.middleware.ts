import passport from 'passport'

const verifyCallback = (req: any, resolve: any) => async (err: any, user: any, info: any) => {
  if (user) {
    req.user = user
  }
  resolve()
}

const optionalAuth = () => async (req: any, res: any, next: any) => {
  return new Promise((resolve) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve))(req, res, next)
  })
    .then(() => next())
    .catch((err: any) => next(err))
}

export default optionalAuth
