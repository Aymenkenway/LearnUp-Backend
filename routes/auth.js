import express from 'express'

const router = express.Router()
import { requireSignin } from '../middlewares/index.js'
import { register, login, logout, currentUser } from '../controllers/auth.js'

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', requireSignin, currentUser)

export default router
