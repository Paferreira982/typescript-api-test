// DEPENDENCIES //
import express from 'express'

// SERVICES //
import UserController from '../controllers/UserController'
// import Validator from '../services/Validator'

const router = express.Router()

router.post('/', UserController.create)
router.put('/', UserController.update)
router.get('/', UserController.find)
router.delete('/:id', UserController.delete)

export default router
