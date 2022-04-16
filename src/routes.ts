import express from 'express'
import UserRoute from './app/routes/UserRoute'

const router = express.Router()

router.use('/users', UserRoute)

export default router
