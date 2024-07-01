import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { getUserById, getUserByEmail, createUser, generatePassword } from '../services/user.service.js'
import envConfig from './env.config.js'

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: envConfig.jwt.secret
  },
  async (payload, done) => {
    try {
      const user = await getUserById(payload.sub)
      if (user) return done(null, user)
      return done(null, false)
    } catch (error) {
      return done(error)
    }
  }
)

const googleStrategy = new GoogleStrategy(
  {
    clientID: envConfig.google.clientId,
    clientSecret: envConfig.google.clientSecret,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ['email', 'profile']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await getUserByEmail(profile.emails?.[0]?.value as string)
      if (user) {
        user.verified = true
        await user.save()
        return done(null, user)
      } else {
        const newUser = await createUser({
          email: profile.emails?.[0]?.value as string,
          name: profile.displayName,
          password: generatePassword(),
          avatar: profile.photos?.[0]?.value as string
        })
        newUser.verified = true
        await newUser.save()
        return done(null, newUser)
      }
    } catch (error) {
      return done(error)
    }
  }
)

export { jwtStrategy, googleStrategy }
