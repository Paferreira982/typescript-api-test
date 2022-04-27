import express from 'express'
import ProfileController from '../controllers/ProfileController'

const router = express.Router()

router.post('/', ProfileController.create)
router.put('/', ProfileController.update)

export default router
