import express from 'express'
import auth from '../../middlewares/auth.middleware.js'
import { AchievementController } from '../../controllers/achievement.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import AchievementValidation from '../../validations/achievement.validation.js'

const controller = new AchievementController()

const router = express.Router()

router.get('/', auth('GET_ACHIEVEMENTS'), validate(AchievementValidation.getAchievements), controller.getAchievements)
router.get(
  '/:achievementId',
  auth('GET_ACHIEVEMENTS'),
  validate(AchievementValidation.getAchievement),
  controller.getAchievement
)
router.post(
  '/',
  auth('MANAGE_ACHIEVEMENTS'),
  validate(AchievementValidation.createAchievement),
  controller.createAchievement
)
router.put(
  '/:achievementId',
  auth('MANAGE_ACHIEVEMENTS'),
  validate(AchievementValidation.updateAchievement),
  controller.updateAchievement
)
router.delete(
  '/:achievementId',
  auth('MANAGE_ACHIEVEMENTS'),
  validate(AchievementValidation.deleteAchievement),
  controller.deleteAchievement
)

export default router

/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: Achievements management and retrieval
 */

/**
 * @swagger
 * /achievements:
 *   get:
 *     summary: Get all achievements
 *     description: Get all achievements
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *         example: name:asc
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *     responses:
 *       200:
 *         description: A list of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Achievement'
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /achievements/{achievementId}:
 *   get:
 *     summary: Get an achievement
 *     description: Get an achievement by id
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         schema:
 *           type: string
 *         required: true
 *         description: Achievement id
 *     responses:
 *       200:
 *         description: An achievement object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /achievements:
 *   post:
 *     summary: Create an achievement
 *     description: Create a new achievement
 *     tags:
 *       - Achievements
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
 *                 example: Achievement name
 *               description:
 *                 type: string
 *                 example: Achievement description
 *             example:
 *               name: Achievement name
 *               description: Achievement description
 *     responses:
 *       201:
 *         description: An achievement object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /achievements/{achievementId}:
 *   put:
 *     summary: Update an achievement
 *     description: Update an achievement by id
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         schema:
 *           type: string
 *         required: true
 *         description: Achievement id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Achievement name
 *               description:
 *                 type: string
 *                 example: Achievement description
 *           example:
 *             name: Achievement name
 *             description: Achievement description
 *     responses:
 *       200:
 *         description: An achievement object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /achievements/{achievementId}:
 *   delete:
 *     summary: Delete an achievement
 *     description: Delete an achievement by id
 *     tags:
 *       - Achievements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         schema:
 *           type: string
 *         required: true
 *         description: Achievement id
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
