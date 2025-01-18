import User from '../models/user.js'
import { hashPassword, comparePassword } from '../utils/auth.js'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import sgMail from '@sendgrid/mail'

// const awsConfig = {
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
//   apiVersion: process.env.AWS_API_VERSION,
// }

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body
    // validation
    if (!name) return res.status(400).send('Name is required')
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required and should be min 6 characters long')
    }
    let userExist = await User.findOne({ email }).exec()
    if (userExist) return res.status(400).send('Email is taken')

    // hash password
    const hashedPassword = await hashPassword(password)

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })
    await user.save()
    // console.log("saved user", user);
    return res.json({ ok: true })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error. Try again.')
  }
}

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body

    // check if our db has user with that email
    const user = await User.findOne({ email }).exec()

    if (!user) return res.status(400).send('No user found')
    // check password
    const match = await comparePassword(password, user.password)
    if (!match) return res.status(400).send('Wrong password')

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1min',
    })
    // return user and token to client, exclude hashed password
    user.password = undefined
    // send token in cookie

    res.cookie('token', token, {
      httpOnly: true,
      // secure: true, // only works on https
    })

    // send user as json response
    res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error. Try again.')
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token')
    return res.json({ message: 'Signout success' })
  } catch (err) {
    console.log(err)
  }
}

export const currentUser = async (req, res) => {
  try {
    console.log('hello', req.body)
    const user = await User.findById(req.user._id).select('-password').exec()
    console.log('hl')
    console.log('CURRENT_USER', user)
    return res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}

export const sendTestEmail = async (req, res) => {
  const msg = {
    to: 'aymenconnor@gmail.com',
    from: process.env.EMAIL_FROM,
    subject: 'Password reset link',
    html: `
      <html>
        <h1>Reset password link</h1>
        <p>Please use the following link to reset your password</p>
      </html>
    `,
  }

  try {
    await sgMail.send(msg)
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    res.status(400).send('Error. Try again.')
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    // Generate a short code
    const shortCode = nanoid(6).toUpperCase()

    // Find the user and update the password reset code
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    )

    if (!user) {
      return res.status(400).send('User not found')
    }

    // Prepare email
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM, // Use the verified sender email address
      subject: 'Reset Password',
      html: `
        <html>
          <h1>Reset Password</h1>
          <p>Use this code to reset your password:</p>
          <h2 style="color: red;">${shortCode}</h2>
          <i>edemy.com</i>
        </html>
      `,
    }

    // Send email using SendGrid
    await sgMail.send(msg)
    console.log('Email sent successfully')
    res.json({ ok: true })
  } catch (err) {
    console.error('Error sending email:', err)
    res.status(500).send('Error sending email')
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    console.table({ email, code, newPassword })
    const hashedPassword = await hashPassword(newPassword)

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: '',
      }
    ).exec()
    res.json({ ok: true })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error! Try again.')
  }
}
