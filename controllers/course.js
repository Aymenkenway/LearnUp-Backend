import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'
import Course from '../models/course.js'
import slugify from 'slugify'
import { readFileSync } from 'fs'
import fs from 'fs'
import User from '../models/user.js'
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body
    if (!image) return res.status(400).send('No image')

    // Prepare the image data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '') // Remove base64 prefix
    const type = image.split(';')[0].split('/')[1] // Extract image type

    // Generate unique filename
    const uniqueFilename = `${nanoid()}.${type}`

    // Upload image to Cloudinary
    cloudinary.uploader.upload(
      `data:image/${type};base64,${base64Data}`, // Send base64 data directly
      {
        public_id: uniqueFilename, // Set the public ID to the generated filename
        folder: 'Learnup-banner-images', // Optional: Specify folder for organization
        resource_type: 'image', // Ensure it’s treated as an image
      },
      (err, result) => {
        if (err) {
          console.error(err)
          return res.sendStatus(400)
        }
        console.log(result) // Log the result
        res.status(200).send({
          url: result.secure_url, // Return the secure URL of the uploaded image
          public_id: result.public_id, // Return the public ID
        })
      }
    )
  } catch (err) {
    console.error(err)
    res.status(500).send('Error uploading image')
  }
}

// Function to remove an image from Cloudinary
export const removeImage = async (req, res) => {
  try {
    const { public_id } = req.body.image // Cloudinary uses `public_id` to identify images

    console.log('reqeust body', req.body.image.public_id)
    if (!public_id) {
      return res.status(400).send('No image specified')
    }
    console.log('here', public_id)
    // Send the delete request to Cloudinary
    cloudinary.uploader.destroy(public_id, (err, result) => {
      if (err) {
        console.error('Error deleting image:', err)
        return res.status(400).send('Failed to delete image')
      }
      res.send({ ok: true, result })
    })
  } catch (err) {
    console.error('Error in removeImage:', err)
    res.status(500).send('Server error')
  }
}

export const create = async (req, res) => {
  // console.log("CREATE COURSE", req.body);
  // return;
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    })
    if (alreadyExist) return res.status(400).send('Title is taken')

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save()

    res.json(course)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Course create failed. Try again.')
  }
}

export const read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', '_id name')
      .exec()
    res.json(course)
  } catch (err) {
    console.log(err)
  }
}

export const uploadVideo = async (req, res) => {
  try {
    if (req.user._id != req.params.instructorId) {
      return res.status(400).send('Unauthorized')
    }
    const { video } = req.files // Assuming `req.files` contains the video file
    console.log(video)
    if (!video) return res.status(400).send('No video')

    // Upload the video to Cloudinary
    const result = await cloudinary.uploader.upload(video.path, {
      resource_type: 'video', // Specify video as the resource type
      folder: 'videos', // Optional: specify a folder to store videos
    })

    // Cleanup: Delete the temporary file after uploading
    fs.unlinkSync(video.path)

    // Send the response with the uploaded video data
    res.send({
      public_id: result.public_id,
      url: result.secure_url,
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Video upload failed')
  }
}

export const removeVideo = async (req, res) => {
  try {
    if (req.user._id != req.params.instructorId) {
      return res.status(400).send('Unauthorized')
    }

    const { public_id } = req.body // Cloudinary uses `public_id` to identify videos
    console.log('shit')
    if (!public_id) {
      return res.status(400).send('No video specified')
    }

    // Send delete request to Cloudinary
    cloudinary.uploader.destroy(
      public_id,
      { resource_type: 'video' },
      (err, result) => {
        if (err) {
          console.error('Error deleting video:', err)
          return res.status(400).send('Failed to delete video')
        }
        res.send({ ok: true, result })
      }
    )
  } catch (err) {
    console.error('Error in removeVideo:', err)
    res.status(500).send('Server error')
  }
}

export const addLesson = async (req, res) => {
  try {
    const { slug, instructorId } = req.params
    const { title, content, video } = req.body

    if (req.user._id != instructorId) {
      return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      { new: true }
    )
      .populate('instructor', '_id name')
      .exec()
    res.json(updated)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Add lesson failed')
  }
}

export const update = async (req, res) => {
  try {
    const { slug } = req.params
    // console.log(slug);
    const course = await Course.findOne({ slug }).exec()
    // console.log("COURSE FOUND => ", course);
    if (req.user._id != course.instructor) {
      return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec()

    res.json(updated)
  } catch (err) {
    console.log(err)
    return res.status(400).send(err.message)
  }
}

export const removeLesson = async (req, res) => {
  const { slug, lessonId } = req.params
  const course = await Course.findOne({ slug }).exec()
  if (req.user._id != course.instructor) {
    return res.status(400).send('Unauthorized')
  }

  const deletedCourse = await Course.findByIdAndUpdate(course._id, {
    $pull: { lessons: { _id: lessonId } },
  }).exec()

  res.json({ ok: true })
}

export const updateLesson = async (req, res) => {
  try {
    const { slug } = req.params
    const { _id, title, content, video, free_preview } = req.body
    // find post
    const course = await Course.findOne({ slug }).select('instructor').exec()
    // is owner?
    if (course.instructor._id != req.user._id) {
      return res.status(400).send('Unauthorized')
    }

    const updated = await Course.updateOne(
      { 'lessons._id': _id },
      {
        $set: {
          'lessons.$.title': title,
          'lessons.$.content': content,
          'lessons.$.video': video,
          'lessons.$.free_preview': free_preview,
        },
      }
    ).exec()
    console.log('updated => ', updated)
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Update lesson failed')
  }
}

export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    // find post
    const course = await Course.findById(courseId).select('instructor').exec()
    // is owner?
    if (course.instructor._id != req.user._id) {
      return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec()
    // console.log("course published", course);
    // return;
    res.json(updated)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Publish course failed')
  }
}

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    // find post
    const course = await Course.findById(courseId).select('instructor').exec()
    // is owner?
    if (course.instructor._id != req.user._id) {
      return res.status(400).send('Unauthorized')
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec()
    // console.log("course published", course);
    // return;
    res.json(updated)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Publish course failed')
  }
}

export const courses = async (req, res) => {
  // console.log("all courses");
  const all = await Course.find({ published: true })
    .populate('instructor', '_id name')
    .exec()
  // console.log("============> ", all);
  res.json(all)
}

export const checkEnrollment = async (req, res) => {
  const { courseId } = req.params
  // find courses of the currently logged in user
  const user = await User.findById(req.user._id).exec()
  // check if course id is found in user courses array
  let ids = []
  let length = user.courses && user.courses.length
  for (let i = 0; i < length; i++) {
    ids.push(user.courses[i].toString())
  }
  res.json({
    status: ids.includes(courseId),
    course: await Course.findById(courseId).exec(),
  })
}

export const freeEnrollment = async (req, res) => {
  try {
    // check if course is free or paid
    const course = await Course.findById(req.params.courseId).exec()
    if (course.paid) return

    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec()
    console.log(result)
    res.json({
      message: 'Congratulations! You have successfully enrolled',
      course,
    })
  } catch (err) {
    console.log('free enrollment err', err)
    return res.status(400).send('Enrollment create failed')
  }
}
