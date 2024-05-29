import express, { Request, Response } from 'express'
import { AuthController } from '../../controllers/auth.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import AuthValidation from '../../validations/auth.validation.js'

const router = express.Router()

const controller = new AuthController()

router.post('/register', validate(AuthValidation.register), controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)

export default router
 