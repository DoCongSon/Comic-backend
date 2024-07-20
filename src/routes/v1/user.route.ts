import express from 'express'
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

router.post('/:userId/points', auth(), validate(UserValidation.updatePoints), controller.updatePointsAndLevel)
router.post('/:userId/achievements', auth(), validate(UserValidation.addAchievement), controller.addAchievementToUser)
router.delete(
  '/:userId/achievements/:achievementId',
  auth(),
  validate(UserValidation.removeAchievement),
  controller.removeAchievementFromUser
)

export default router

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userQuery
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             role:
 *               type: string
 *               enum: [USER, ADMIN, USERVIP]
 *             sortBy:
 *               type: string
 *             limit:
 *               type: integer
 *             page:
 *               type: integer
 *             populate:
 *               type: string
 *         example:
 *           name: John Doe
 *           role: USER
 *           sortBy: createdAt:desc
 *           limit: 10
 *           page: 1
 *           populate: progress.achievements
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     description: Get user by id
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     description: Create a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Must be at least 6 characters and at contain at least one number and one letter
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, USERVIP]
 *               avatar:
 *                type: string
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             example:
 *               email: 'test@example.com'
 *               password: 'password123'
 *               name: 'John Doe'
 *               role: 'USER'
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     description: Update a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Must be at least 6 characters and at contain at least one number and one letter
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, USERVIP]
 *               avatar:
 *                 type: string
 *             example:
 *               email: 'test@example.com'
 *               password: 'password123'
 *               name: 'John Doe'
 *               role: 'USER'
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     description: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/{userId}/points:
 *   post:
 *     description: Update user points
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: integer
 *             required:
 *               - points
 *             example:
 *               points: 100
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/{userId}/achievements:
 *   post:
 *     description: Add an achievement to a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               achievementId:
 *                 type: string
 *             required:
 *               - achievementId
 *             example:
 *               achievementId: 5f0b5e9d4f2f31b3c1f7f8ca
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/{userId}/achievements/{achievementId}:
 *   delete:
 *     description: Remove an achievement from a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *       - in: path
 *         name: achievementId
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f0b5e9d4f2f31b3c1f7f8ca
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
