import express from 'express'
import ProfileController from '../controllers/ProfileController'

const router = express.Router()

router.get('/', ProfileController.find)
router.post('/', ProfileController.create)
router.put('/', ProfileController.update)
router.delete('/:id?', ProfileController.delete)

export default router
