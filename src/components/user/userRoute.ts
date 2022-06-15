import auth from '../../middlewares/auth'
import express from 'express'
import {
  fogetPassword,
  login,
  register,
  resetPassword,
  updateUser,
} from './userController'

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.put('/update', auth, updateUser)

router.post('/fogetPassword', fogetPassword)
router.post('/resetPassword/:token', resetPassword)

export default router
