import express, { Request, Response } from 'express'
import auth from '../../middlewares/auth.middleware.js'
import { UserController } from '../../controllers/user.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import UserValidation from '../../validations/user.validation.js'

const router = express.Router()

const controller = new UserController()

router.get('/', auth('GET_USERS'), validate(UserValidation.getUsers), controller.getUsers)
router.get('/:userId', auth('MANAGE_USERS'), validate(UserValidation.getUser), controller.getUser)
router.post('/', auth('MANAGE_USERS'), validate(UserValidation.createUser), controller.createUser)
router.put('/:userId', auth('MANAGE_USERS'), validate(UserValidation.updateUser), controller.updateUser)
router.delete('/:userId', auth('MANAGE_USERS'), validate(UserValidation.deleteUser), controller.deleteUser)

export default router
