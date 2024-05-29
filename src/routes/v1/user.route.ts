import express, { Request, Response } from 'express'
import auth from '../../middlewares/auth.middleware.js'
import { UserController } from '../../controllers/user.controller.js'

const router = express.Router()

const controller = new UserController()

router.get('/', auth('GET_USERS'), controller.getUsers)

export default router
