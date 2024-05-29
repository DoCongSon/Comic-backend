import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../models/user.model.js'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
}

const jwtStrategy = new Strategy(opts, async (payload, done) => {
  try {
    const user = User.findById(payload.id)
    if (user) return done(null, user)
  } catch (error) {
    return done(error)
  }
})

export { jwtStrategy }
