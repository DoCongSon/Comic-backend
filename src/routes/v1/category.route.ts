import express from 'express'
import { CategoryController } from '../../controllers/category.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import CategoryValidation from '../../validations/category.validation.js'
import auth from '../../middlewares/auth.middleware.js'
const router = express.Router()

const controller = new CategoryController()

router.post('/get-categories-from-api', controller.getCategoriesFromApi)

router.get('/', validate(CategoryValidation.getCategories), controller.getCategories)
router.get('/:categoryId', validate(CategoryValidation.getCategory), controller.getCategory)
router.post('/', auth('MANAGE_CATEGORIES'), validate(CategoryValidation.createCategory), controller.createCategory)
router.put(
  '/:categoryId',
  auth('MANAGE_CATEGORIES'),
  validate(CategoryValidation.updateCategory),
  controller.updateCategory
)
router.delete(
  '/:categoryId',
  auth('MANAGE_CATEGORIES'),
  validate(CategoryValidation.deleteCategory),
  controller.deleteCategory
)

export default router

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories management and retrieval
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Get all categories
 *     tags:
 *       - Categories
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
 *         description: Category name
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
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
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Get a category
 *     description: Get a category by id
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category id
 *     responses:
 *       200:
 *         description: A category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     description: Create a new category
 *     tags:
 *       - Categories
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
 *                 example: Category name
 *               slug:
 *                 type: string
 *                 example: category-name
 *           example:
 *             name: Category name
 *             slug: category-name
 *     responses:
 *       201:
 *         description: A category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a category
 *     description: Update a category by id
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Category name
 *               slug:
 *                 type: string
 *                 example: category-name
 *           example:
 *             name: Category name
 *             slug: category-name
 *     responses:
 *       200:
 *         description: A category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category by id
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category id
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
