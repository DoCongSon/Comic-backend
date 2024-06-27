import express from 'express'
import authRoute from './auth.route.js'
import userRoute from './user.route.js'
import achievementRoute from './achievement.route.js'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/achievements', achievementRoute)

export default router
