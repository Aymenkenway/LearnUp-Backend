import express from 'express'

const router = express.Router()
import { register } from '../controllers/auth.js'

router.post('/register', register)

export default router
