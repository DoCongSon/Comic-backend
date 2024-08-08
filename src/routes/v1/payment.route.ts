import express from 'express'
import { PaymentController } from '../../controllers/payment.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import PaymentValidation from '../../validations/payment.validation.js'
import auth from '../../middlewares/auth.middleware.js'
const router = express.Router()

const controller = new PaymentController()

router.get('/', auth('MANAGE_PAYMENTS'), validate(PaymentValidation.getPayments), controller.getPayments)
router.get('/:paymentId', auth('MANAGE_PAYMENTS'), validate(PaymentValidation.getPayment), controller.getPayment)
router.post('/', auth(), validate(PaymentValidation.createPayment), controller.createPayment)
router.put('/:paymentId', auth('MANAGE_PAYMENTS'), validate(PaymentValidation.updatePayment), controller.updatePayment)
router.delete(
  '/:paymentId',
  auth('MANAGE_PAYMENTS'),
  validate(PaymentValidation.deletePayment),
  controller.deletePayment
)
router.post(
  '/:paymentId/handle',
  auth('MANAGE_PAYMENTS'),
  validate(PaymentValidation.handlePayment),
  controller.handlePayment
)

export default router

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management and retrieval
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     description: Only admins can retrieve all payments.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of payments to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
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
 *                     $ref: '#/components/schemas/Payment'
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
 * /payments/{paymentId}:
 *   get:
 *     summary: Get a payment
 *     description: Only admins can fetch any payment.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a payment
 *     description: Only authenticated users can create payments.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentCreate'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /payments/{paymentId}:
 *   put:
 *     summary: Update a payment
 *     description: Only admins can update any payment.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               code:
 *                 type: string
 *               ruby:
 *                 type: number
 *             example:
 *               user: 5f8a5e7f575d7a4d8f4c5347
 *               code: PAYMENT_CODE
 *               ruby: 100
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /payments/{paymentId}:
 *   delete:
 *     summary: Delete a payment
 *     description: Only admins can delete any payment.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment id
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /payments/{paymentId}/handle:
 *   post:
 *     summary: Handle a payment
 *     description: Only admins can handle payments.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment id
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
