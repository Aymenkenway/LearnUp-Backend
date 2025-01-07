import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'

dotenv.config()

const csrfProtection = csrf({ cookie: true })

// create express app
const app = express()

//db

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

// apply middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(csrfProtection)
app.use(morgan('dev'))

// Use dynamic import with ES module
fs.readdirSync('./routes').map((r) =>
  import(`./routes/${r}`)
    .then((route) => {
      app.use('/api', route.default)
    })
    .catch((err) => {
      console.error(`Failed to load route ${r}:`, err)
    })
) // csrf

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
