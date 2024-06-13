import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../models/user.model.js'
import { getUserById } from '../services/user.service.js'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
}

const jwtStrategy = new Strategy(opts, async (payload, done) => {
  try {
    const user = await getUserById(payload.sub)
    if (user) return done(null, user)
    return done(null, false)
  } catch (error) {
    return done(error)
  }
})

export { jwtStrategy }
