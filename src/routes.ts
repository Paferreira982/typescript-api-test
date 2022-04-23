import express from 'express'
import Validator from './app/services/Validator'

import AuthRote from './app/routes/AuthRote'
import UserRoute from './app/routes/UserRoute'

const router = express.Router()
const path = '/ritter/api'

router.use(`${path}/auth`, AuthRote)
router.use(`${path}/users`, Validator.validateRequest, UserRoute)

export default router
