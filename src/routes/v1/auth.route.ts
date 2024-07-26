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
router.post('/change-password', auth(), validate(AuthValidation.changePassword), controller.changePassword)
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
router.post('/update-profile', auth(), validate(AuthValidation.updateProfile), controller.updateProfile)

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
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *                 - name
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email must be unique
 *                 password:
 *                   type: string
 *                   format: password
 *                   minimum: 6
 *                   description: User's password must be at least 6 characters and at least one letter and one number
 *                 name:
 *                   type: string
 *               example:
 *                  name: 'John'
 *                  email: 'john@example.com'
 *                  password: 'password123'
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       422:
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login with email and password
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: 'john@example.com'
 *               password: 'password123'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       422:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: Invalid email or password
 *               code: 422
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     description: Logout
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     tags:
 *       - Auth
 *     description: Refresh auth tokens
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       200:
 *         description: Refreshed tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   get:
 *     tags:
 *       - Auth
 *     description: Reset password
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             email:
 *               type: string
 *         example:
 *           token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjdkNjIwMWUzYjY2OTY0ZGQwODFjZDgiLCJpYXQiOjE3MjA0MzY1MjIsImV4cCI6MTcyMDQ0MDEyMiwidHlwZSI6IkFDQ0VTUyJ9.YwFb_MKtxpIXjmNCzm0SSBumJRREOqwh9VpnX-Uyd0c'
 *           email: 'john@example.com'
 *     responses:
 *       200:
 *         description: Reset password
 *       404:
 *        $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     description: Forgot password
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: 'john@example.com'
 *     responses:
 *       200:
 *         description: Reset password email sent
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/change-password:
 *  post:
 *    tags:
 *      - Auth
 *    description: Change password
 *    produces:
 *      - application/json
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - oldPassword
 *              - newPassword
 *            properties:
 *              oldPassword:
 *                type: string
 *                format: password
 *              newPassword:
 *               type: string
 *               format: password
 *               minimum: 6
 *               description: User's password must be at least 6 characters and at least one letter and one number
 *            example:
 *              oldPassword: 'password123'
 *              newPassword: 'newPassword123'
 *    responses:
 *      204:
 *        description: No content
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     tags:
 *       - Auth
 *     description: Verify email
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *         example:
 *           token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjdkNjIwMWUzYjY2OTY0ZGQwODFjZDgiLCJpYXQiOjE3MjA0MzY1MjIsImV4cCI6MTcyMDQ0MDEyMiwidHlwZSI6IkFDQ0VTUyJ9.YwFb_MKtxpIXjmNCzm0SSBumJRREOqwh9VpnX-Uyd0c'
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *        $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     tags:
 *       - Auth
 *     description: Send verification email
 *     produces:
 *       - application/json
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     description: Get current user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/update-profile:
 *   post:
 *     tags:
 *       - Auth
 *     description: Update profile
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               avatar:
 *                 type: string
 *             example:
 *               name: 'John'
 *               email: 'fakeemail@gmail.com'
 *               avatar: 'https://example.com/new-avatar.jpg'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     description: Google login
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: return
 *         schema:
 *           type: string
 *         example:
 *           return: 'http://example.com/login'
 */
