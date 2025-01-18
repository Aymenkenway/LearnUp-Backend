import express from 'express'

const router = express.Router()
import formidable from 'express-formidable'
// middleware
import { requireSignin, isInstructor } from '../middlewares/index.js'

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
} from '../controllers/course.js'

router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)
router.post('/course', requireSignin, isInstructor, create)
router.get('/course/:slug', read)
// router.post('/course/video-upload', requireSignin, formidable(), uploadVideo)
// router.post('/course/video-remove', requireSignin, removeVideo)

router.post(
  '/course/video-upload/:instructorId',
  requireSignin,
  formidable(),
  uploadVideo
)
router.post('/course/video-remove/:instructorId', requireSignin, removeVideo)
router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson)
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson)
router.put('/course/:slug', requireSignin, update)
router.put('/course/:slug/:lessonId', requireSignin, removeLesson)

export default router
