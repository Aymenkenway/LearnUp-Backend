import express from 'express'

const router = express.Router()

// middleware
import { requireSignin, isInstructor } from '../middlewares/index.js'

// controllers
import { uploadImage, removeImage, create } from '../controllers/course.js'

router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)
router.post('/course', requireSignin, isInstructor, create)

export default router
