import express from 'express'
import authRoute from './auth.route.js'
import userRoute from './user.route.js'
import comicRoute from './comic.route.js'
import categoryRoute from './category.route.js'
import achievementRoute from './achievement.route.js'
import paymentRoute from './payment.route.js'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/comics', comicRoute)
router.use('/categories', categoryRoute)
router.use('/achievements', achievementRoute)
router.use('/payments', paymentRoute)

export default router
