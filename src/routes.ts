// DEPENDENCIES //
import express from 'express'

// SERVICES //
import AuthRote from './app/routes/AuthRote'
import UserRoute from './app/routes/UserRoute'

const router = express.Router()
const path = '/ritter/api'

router.use(`${path}/auth`, AuthRote)
router.use(`${path}/users`, UserRoute)

export default router
