import express from 'express'
import UserController from '../controllers/UserController'

const router = express.Router()

router.post('/', UserController.create)
router.put('/', UserController.update)

export default router
