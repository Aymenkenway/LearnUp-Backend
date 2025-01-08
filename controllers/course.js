import { v2 as cloudinary } from 'cloudinary'
import { nanoid } from 'nanoid'
import Course from '../models/course.js'
import slugify from 'slugify'
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
