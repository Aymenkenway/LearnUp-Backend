import express from 'express'

const router = express.Router()

// middleware
import { requireSignin } from '../middlewares/index.js'

// controllers
import {
  getAccountStatus,
  makeInstructor,
  currentInstructor,
} from '../controllers/instructor.js'

router.post('/make-instructor', requireSignin, makeInstructor)
router.get('/current-instructor', requireSignin, currentInstructor)
router.post('/get-account-status', requireSignin, getAccountStatus)

export default router
