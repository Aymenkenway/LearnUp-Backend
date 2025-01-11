import express from 'express'

const router = express.Router()

// middleware
import { requireSignin, isInstructor } from '../middlewares/index.js'

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
} from '../controllers/course.js'

router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)
router.post('/course', requireSignin, isInstructor, create)
router.get('/course/:slug', read)

export default router
