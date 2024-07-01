import express, { Request, Response } from 'express'
import { AuthController } from '../../controllers/auth.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import auth from '../../middlewares/auth.middleware.js'
import AuthValidation from '../../validations/auth.validation.js'
import passport from 'passport'

const router = express.Router()

const controller = new AuthController()

router.post('/register', validate(AuthValidation.register), controller.register)
router.post('/login', validate(AuthValidation.login), controller.login)
router.post('/logout', validate(AuthValidation.logout), controller.logout)
router.post('/refresh-tokens', validate(AuthValidation.refreshTokens), controller.refreshTokens)
router.get('/reset-password', validate(AuthValidation.resetPassword), controller.resetPassword)
router.post('/forgot-password', validate(AuthValidation.forgotPassword), controller.forgotPassword)
router.post('/verify-email', validate(AuthValidation.verifyEmail), controller.verifyEmail)
router.post('/send-verification-email', auth(), controller.sendVerificationEmail)
router.get('/me', auth(), controller.me)
router.get('/google', validate(AuthValidation.google), (req, res, next) => {
  const state = encodeURIComponent(JSON.stringify({ returnTo: req.query.return || '/' }))
  passport.authenticate('google', { scope: ['email', 'profile'], state })(req, res, next)
})
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  controller.google
)

export default router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: Register a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User's entity
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully registered
 */
