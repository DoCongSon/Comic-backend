import express from 'express'
import { ComicController } from '../../controllers/comic.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import ComicValidation from '../../validations/comic.validation.js'
import auth from '../../middlewares/auth.middleware.js'
import optionalAuth from '../../middlewares/optionalAuth.middleware.js'

const router = express.Router()

const controller = new ComicController()

router.post('/get-comics-from-api', controller.getComicsFromApi)

router.get('/top-viewed', controller.getTopViewedComics)

router.get('/', validate(ComicValidation.getComics), controller.getComics)
router.post('/', auth('MANAGE_COMICS'), validate(ComicValidation.createComic), controller.createComic)
router.get('/:comicIdOrSlug', validate(ComicValidation.getComic), controller.getComic)
router.put('/:comicId', auth('MANAGE_COMICS'), validate(ComicValidation.updateComic), controller.updateComic)
router.delete('/:comicId', auth('MANAGE_COMICS'), validate(ComicValidation.deleteComic), controller.deleteComic)

router.get('/:comicId/chapters', validate(ComicValidation.getChapters), controller.getChapters)
router.post(
  '/:comicId/chapters',
  auth('MANAGE_COMICS'),
  validate(ComicValidation.createChapter),
  controller.createChapter
)
router.get(
  '/:comicIdOrSlug/chapters/:chapterId',
  optionalAuth(),
  validate(ComicValidation.getChapter),
  controller.getChapter
)
router.put(
  '/:comicId/chapters/:chapterId',
  auth('MANAGE_COMICS'),
  validate(ComicValidation.updateChapter),
  controller.updateChapter
)
router.delete(
  '/:comicId/chapters/:chapterId',
  auth('MANAGE_COMICS'),
  validate(ComicValidation.deleteChapter),
  controller.deleteChapter
)

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
 *         example: like:desc
 *       - in: query
 *         name: vip
 *         schema:
 *           type: boolean | 1 | 0
 *           enum: [true, false, 1, 0]
 *         description: Comic vip status
 *         example: false
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [coming_soon, completed, ongoing]
 *         description: Comic status
 *         example: ongoing
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Comic name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Comic category slug
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
 * /comics/{comicIdOrSlug}:
 *   get:
 *     summary: Get comic
 *     description: Get a comic by id or slug
 *     tags:
 *       - Comics
 *     parameters:
 *       - in: path
 *         name: comicIdOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic id or slug
 *     responses:
 *       200:
 *         description: A comic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ComicDetail'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
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

/**
 * @swagger
 * /comics/{comicId}/chapters:
 *   get:
 *     summary: Get chapters
 *     description: Get all chapters of a comic
 *     tags:
 *       - Comics
 *     parameters:
 *       - in: path
 *         name: comicId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic id
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
 *     responses:
 *       200:
 *         description: A list of chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chapter'
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /comics/{comicId}/chapters:
 *   post:
 *     summary: Create chapter
 *     description: Create a new chapter of a comic
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
 *               chapter_name:
 *                 type: number
 *               chapter_path:
 *                 type: string
 *               chapter_images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     image_page:
 *                       type: number
 *                     image_file:
 *                       type: string
 *           example:
 *             chapter_name: 1
 *             chapter_path: https://chapter-path.com
 *             chapter_images: [{image_page: 1, image_file: https://image-file.com}]
 *     responses:
 *       201:
 *         description: A chapter object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /comics/{comicIdOrSlug}/chapters/{chapterId}:
 *   get:
 *     summary: Get chapter
 *     description: Get a chapter by id or slug
 *     tags:
 *       - Comics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comicIdOrSlug
 *         schema:
 *           type: string
 *         required: true
 *         description: Comic id or slug
 *       - in: path
 *         name: chapterId
 *         schema:
 *           type: string
 *         required: true
 *         description: Chapter id
 *     responses:
 *       200:
 *         description: A chapter object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /comics/{comicId}/chapters/{chapterId}:
 *   put:
 *     summary: Update chapter
 *     description: Update a chapter by id
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
 *       - in: path
 *         name: chapterId
 *         schema:
 *           type: string
 *         required: true
 *         description: Chapter id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapter_name:
 *                 type: number
 *               chapter_path:
 *                 type: string
 *               chapter_images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     image_page:
 *                       type: number
 *                     image_file:
 *                       type: string
 *           example:
 *             chapter_name: 1
 *             chapter_path: https://chapter-path.com
 *             chapter_images: [{image_page: 1, image_file: https://image-file.com}]
 *     responses:
 *       200:
 *         description: A chapter object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /comics/{comicId}/chapters/{chapterId}:
 *   delete:
 *     summary: Delete chapter
 *     description: Delete a chapter by id
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
 *       - in: path
 *         name: chapterId
 *         schema:
 *           type: string
 *         required: true
 *         description: Chapter id
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
 * /comics/top-viewed:
 *   get:
 *     summary: Get top viewed comics
 *     description: Get top viewed comics
 *     tags:
 *       - Comics
 *     responses:
 *       200:
 *         description: A list of comics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comic'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
