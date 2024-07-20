import express from 'express'
import { ComicController } from '../../controllers/comic.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import ComicValidation from '../../validations/comic.validation.js'
import auth from '../../middlewares/auth.middleware.js'

const router = express.Router()

const controller = new ComicController()

router.post('/get-comics-from-api', controller.getComicsFromApi)

router.get('/', validate(ComicValidation.getComics), controller.getComics)
router.post('/', auth('MANAGE_COMICS'), validate(ComicValidation.createComic), controller.createComic)
router.get('/:comicId', validate(ComicValidation.getComic), controller.getComic)
router.get('/:slug', validate(ComicValidation.getComicBySlug), controller.getComicBySlug)
router.put('/:comicId', auth('MANAGE_COMICS'), validate(ComicValidation.updateComic), controller.updateComic)
router.delete('/:comicId', auth('MANAGE_COMICS'), validate(ComicValidation.deleteComic), controller.deleteComic)

// router.get('/:comicId/chapters', validate(ComicValidation.getChapters), controller.getChapters)
// router.post(
//   '/:comicId/chapters',
//   auth('MANAGE_COMICS'),
//   validate(ComicValidation.createChapter),
//   controller.createChapter
// )
// router.get('/:comicId/chapters/:chapterId', validate(ComicValidation.getChapter), controller.getChapter)
// router.put(
//   '/:comicId/chapters/:chapterId',
//   auth('MANAGE_COMICS'),
//   validate(ComicValidation.updateChapter),
//   controller.updateChapter
// )
// router.delete(
//   '/:comicId/chapters/:chapterId',
//   auth('MANAGE_COMICS'),
//   validate(ComicValidation.deleteChapter),
//   controller.deleteChapter
// )

export default router

/**
 * @swagger
 * tags:
 *   name: Comics
 *   description: Comic management and retrieval
 */

/**
 * @swagger
 * /comics:
 *   get:
 *     summary: Get comics
 *     description: Get all comics
 *     tags:
 *       - Comics
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
 *         description: Comic name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Comic status
 *         example: ongoing
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Comic category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Comic author
 *     responses:
 *       200:
 *         description: A list of comics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comic'
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
 */

/**
 * @swagger
 * /comics:
 *   post:
 *     summary: Create comic
 *     description: Create a new comic
 *     tags:
 *       - Comics
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
 *               origin_name:
 *                 type: array
 *                 items:
 *                   type: string
 *               slug:
 *                 type: string
 *               vip:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [ongoing, completed]
 *               content:
 *                 type: string
 *               thumb_url:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               author:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             name: Comic name
 *             origin_name: ["Comic origin name"]
 *             slug: comic-slug
 *             vip: false
 *             status: ongoing
 *             content: Comic content
 *             thumb_url: https://comic-thumb-url.com
 *             category: ["category-id"]
 *             author: ["author-name"]
 *     responses:
 *       201:
 *         description: A comic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /comics/{comicId}:
 *   get:
 *     summary: Get comic
 *     description: Get a comic by id
 *     tags:
 *       - Comics
 *     parameters:
 *       - in: path
 *         name: comicId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic id
 *     responses:
 *       200:
 *         description: A comic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * /comics/{slug}:
 *   get:
 *     summary: Get comic by slug
 *     description: Get a comic by slug
 *     tags:
 *       - Comics
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic slug
 *     responses:
 *       200:
 *         description: A comic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /comics/{comicId}:
 *   put:
 *     summary: Update comic
 *     description: Update a comic by id
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comicId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               origin_name:
 *                 type: array
 *                 items:
 *                   type: string
 *               slug:
 *                 type: string
 *               vip:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [ongoing, completed]
 *               content:
 *                 type: string
 *               thumb_url:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               author:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             name: Comic name
 *             origin_name: ["Comic origin name"]
 *             slug: comic-slug
 *             vip: false
 *             status: ongoing
 *             content: Comic content
 *             thumb_url: https://comic-thumb-url.com
 *             category: ["category-id"]
 *             author: ["author-name"]
 *     responses:
 *       200:
 *         description: A comic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /comics/{comicId}:
 *   delete:
 *     summary: Delete comic
 *     description: Delete a comic by id
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comicId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic id
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
