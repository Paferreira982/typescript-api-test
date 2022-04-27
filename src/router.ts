import express from 'express'
import Validator from './app/services/Validator'

import AuthRoter from './app/routes/AuthRouter'
import UserRouter from './app/routes/UserRouter'
import ProfileRouter from './app/routes/ProfileRouter'

const router = express.Router()
const path = '/ritter/api'

router.use(`${path}/auth`, AuthRoter)
router.use(`${path}/users`, Validator.validateRequest, UserRouter)
router.use(`${path}/profiles`, Validator.validateRequest, ProfileRouter)

export default router
