import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Server is running!')
})

//db

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Use dynamic import with ES module
fs.readdirSync('./routes').map((r) =>
  import(`./routes/${r}`)
    .then((route) => {
      app.use('/api', route.default)
    })
    .catch((err) => {
      console.error(`Failed to load route ${r}:`, err)
    })
)
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
