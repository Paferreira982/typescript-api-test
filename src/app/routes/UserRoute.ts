import express from 'express'
import UserController from '../controllers/UserController'

const router = express.Router()

router.post('/', UserController.create)
router.put('/', UserController.update)
router.get('/:id?', UserController.find)
router.delete('/:id', UserController.delete)

export default router
